-- =====================================================================
-- PLATAFORMA DE GESTÃO INTERNA — ESCRITÓRIO DE ARQUITETURA (PÚBLICO A)
-- Schema PostgreSQL para Supabase
--
-- Módulos:
--   1. Curadoria de Clientes (CRM)
--   2. Projetos (Operacional)
--   3. Financeiro e Contratos (Administrativo)
--
-- Decisões de arquitetura:
--   - UUID como chave primária em todas as tabelas (padrão Supabase,
--     evita IDs sequenciais previsíveis expostos via API).
--   - Status/categorias usam TEXT + CHECK CONSTRAINT nomeada, em vez de
--     ENUM nativo do Postgres. ENUM exige ALTER TYPE (bloqueante e mais
--     burocrático) para adicionar um valor novo; CHECK é um
--     DROP CONSTRAINT/ADD CONSTRAINT simples — mais alinhado com um
--     produto que vai "começar simples e ir aprimorando".
--   - Soft delete (coluna deleted_at) nas tabelas com valor histórico/
--     jurídico (clientes, projetos, contratos) — nunca apagar de fato.
--   - RLS (Row Level Security) habilitado em todas as tabelas, com
--     policies que respeitam o campo nivel_sigilo (clientes/projetos
--     confidenciais só ficam visíveis para o responsável direto ou para
--     quem tem a flag pode_ver_confidencial).
-- =====================================================================


-- =====================================================================
-- 0. EXTENSÕES
-- =====================================================================

-- gen_random_uuid() — geração de UUID v4 nativa
create extension if not exists "pgcrypto";


-- =====================================================================
-- 1. USUÁRIOS (equipe interna do escritório)
-- ---------------------------------------------------------------------
-- Estende auth.users (tabela de autenticação do Supabase) com os dados
-- de negócio da equipe. O id é o MESMO id do auth.users — não é uma
-- FK solta, é uma extensão 1:1 da linha de autenticação.
-- =====================================================================

create table public.usuarios (
  id                     uuid primary key references auth.users(id) on delete cascade,
  nome_completo          text not null,
  email                  text not null unique,
  cargo                  text not null default 'arquiteto_junior'
                           constraint chk_usuarios_cargo check (
                             cargo in ('socio','arquiteto_senior','arquiteto_junior',
                                       'designer_interiores','estagiario',
                                       'administrativo','financeiro')
                           ),
  -- Controla quem pode ver clientes/projetos marcados como confidenciais
  -- (perfil de cliente de alto patrimônio que exige sigilo interno).
  pode_ver_confidencial  boolean not null default false,
  ativo                  boolean not null default true,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

comment on table public.usuarios is
  'Equipe interna do escritório. Extensão 1:1 de auth.users com dados de negócio.';


-- =====================================================================
-- 2. MÓDULO 1 — CURADORIA DE CLIENTES (CRM)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 2.1 clientes
-- ---------------------------------------------------------------------
create table public.clientes (
  id                        uuid primary key default gen_random_uuid(),

  -- Dados pessoais / cadastrais
  tipo_pessoa               text not null default 'PF'
                              constraint chk_clientes_tipo_pessoa check (tipo_pessoa in ('PF','PJ')),
  nome_razao_social         text not null,
  nome_fantasia             text,                         -- aplicável quando tipo_pessoa = 'PJ'
  cpf_cnpj                  text unique,
  email_principal           text,
  telefone_principal        text,
  data_nascimento           date,                          -- usado no painel de aniversários

  -- Endereço completo
  logradouro                text,
  numero                    text,
  complemento               text,
  bairro                    text,
  cidade                    text,
  estado                    char(2),
  cep                       text,
  pais                      text not null default 'Brasil',

  -- Preferências estéticas — schema flexível de propósito, pois varia
  -- muito de cliente para cliente e tende a crescer com o tempo.
  -- Exemplo de conteúdo:
  -- {
  --   "estilo": "minimalista",
  --   "paleta_preferida": ["tons neutros", "madeira clara"],
  --   "materiais_evitar": ["laminado", "vidro fumê"],
  --   "referencias": ["Studio Mumbai", "John Pawson"]
  -- }
  preferencias_esteticas    jsonb not null default '{}'::jsonb,

  -- Qualificação comercial
  nivel_investimento        text
                              constraint chk_clientes_nivel_investimento check (
                                nivel_investimento in ('Standard','Premium','VIP')
                              ),
  status_prospeccao         text not null default 'lead'
                              constraint chk_clientes_status_prospeccao check (
                                status_prospeccao in (
                                  'lead','em_qualificacao','proposta_enviada',
                                  'negociacao','cliente_ativo','cliente_inativo','perdido'
                                )
                              ),
  origem_lead                text,   -- livre; ex: 'Indicação', 'Instagram', 'Feira/evento'
  motivo_perda               text,   -- preenchido só quando status_prospeccao = 'perdido'

  responsavel_id            uuid references public.usuarios(id),

  -- Sigilo — ver nota de arquitetura no topo do arquivo
  nivel_sigilo               text not null default 'normal'
                              constraint chk_clientes_nivel_sigilo check (nivel_sigilo in ('normal','confidencial')),

  observacoes                text,

  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now(),
  deleted_at                 timestamptz   -- soft delete
);

comment on table public.clientes is
  'Cadastro central de clientes (PF/PJ) do escritório — núcleo do módulo de Curadoria (CRM).';
comment on column public.clientes.preferencias_esteticas is
  'JSON livre com preferências de estilo, materiais e referências do cliente.';
comment on column public.clientes.nivel_sigilo is
  'Quando "confidencial", o registro só é visível ao responsável direto ou a usuários com pode_ver_confidencial = true (ver RLS).';


-- ---------------------------------------------------------------------
-- 2.2 clientes_contatos_adicionais
-- Pessoas de contato adicionais (comum em clientes PJ: sócio, assessor,
-- despachante de obra) ou contatos de apoio de um cliente PF (cônjuge).
-- ---------------------------------------------------------------------
create table public.clientes_contatos_adicionais (
  id            uuid primary key default gen_random_uuid(),
  cliente_id    uuid not null references public.clientes(id) on delete cascade,
  nome          text not null,
  cargo_relacao text,             -- ex: 'Assessor financeiro', 'Cônjuge'
  email         text,
  telefone      text,
  is_principal  boolean not null default false,
  created_at    timestamptz not null default now()
);

comment on table public.clientes_contatos_adicionais is
  'Contatos adicionais vinculados a um cliente (sócios, assessores, familiares).';


-- ---------------------------------------------------------------------
-- 2.3 clientes_interacoes
-- Histórico de contato — todo ponto de contato comercial fica registrado
-- aqui, garantindo que nenhum cliente de alto valor "esfrie" sem
-- acompanhamento.
-- ---------------------------------------------------------------------
create table public.clientes_interacoes (
  id                  uuid primary key default gen_random_uuid(),
  cliente_id          uuid not null references public.clientes(id) on delete cascade,
  usuario_id          uuid references public.usuarios(id),   -- quem registrou o contato
  tipo_interacao      text not null
                        constraint chk_interacoes_tipo check (
                          tipo_interacao in ('ligacao','reuniao','email','whatsapp','visita_tecnica','outro')
                        ),
  data_interacao      timestamptz not null default now(),
  resumo              text not null,
  proxima_acao        text,
  data_proxima_acao   date,
  created_at          timestamptz not null default now()
);

comment on table public.clientes_interacoes is
  'Histórico de contato com o cliente (ligações, reuniões, e-mails, visitas técnicas).';


-- =====================================================================
-- 3. MÓDULO 2 — PROJETOS (OPERACIONAL)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 3.1 projetos
-- ---------------------------------------------------------------------
create table public.projetos (
  id                          uuid primary key default gen_random_uuid(),
  cliente_id                  uuid not null references public.clientes(id),
  codigo_projeto              text unique,             -- código interno, ex: 'PRJ-2026-014'
  nome_projeto                text not null,
  tipo_projeto                text
                                constraint chk_projetos_tipo check (
                                  tipo_projeto in ('Residencial','Comercial','Corporativo',
                                                    'Paisagismo','Interiores','Reforma')
                                ),

  status                      text not null default 'briefing'
                                constraint chk_projetos_status check (
                                  status in ('briefing','em_desenvolvimento','em_aprovacao_cliente',
                                             'em_execucao_obra','pausado','concluido','cancelado')
                                ),

  arquiteto_responsavel_id    uuid references public.usuarios(id),

  -- Prazos
  data_inicio                 date,
  prazo_entrega                date,
  data_conclusao_real          date,

  area_construida_m2           numeric(10,2),

  nivel_sigilo                 text not null default 'normal'
                                constraint chk_projetos_nivel_sigilo check (nivel_sigilo in ('normal','confidencial')),

  created_at                   timestamptz not null default now(),
  updated_at                   timestamptz not null default now(),
  deleted_at                   timestamptz
);

comment on table public.projetos is
  'Projetos vinculados a um cliente — núcleo do módulo Operacional.';
comment on column public.projetos.nivel_sigilo is
  'Independente do sigilo do cliente — permite marcar um projeto específico como confidencial.';


-- ---------------------------------------------------------------------
-- 3.2 projeto_etapas
-- Etapas do fluxo de trabalho arquitetônico, em ordem.
-- ---------------------------------------------------------------------
create table public.projeto_etapas (
  id                     uuid primary key default gen_random_uuid(),
  projeto_id             uuid not null references public.projetos(id) on delete cascade,
  nome_etapa             text not null
                           constraint chk_etapas_nome check (
                             nome_etapa in ('levantamento','estudo_preliminar','anteprojeto',
                                            'projeto_legal','projeto_executivo','detalhamento',
                                            'acompanhamento_obra')
                           ),
  ordem                  smallint not null,
  status                 text not null default 'nao_iniciada'
                           constraint chk_etapas_status check (
                             status in ('nao_iniciada','em_andamento','em_revisao_interna',
                                        'aguardando_aprovacao_cliente','aprovada','concluida')
                           ),
  data_inicio_prevista   date,
  data_fim_prevista      date,
  data_conclusao_real    date,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  constraint uq_projeto_etapa_ordem unique (projeto_id, ordem)
);

comment on table public.projeto_etapas is
  'Etapas do fluxo de projeto arquitetônico (levantamento → executivo → obra), em ordem sequencial.';


-- ---------------------------------------------------------------------
-- 3.3 projeto_equipe
-- Relação N:N entre projetos e usuários (equipe alocada).
-- ---------------------------------------------------------------------
create table public.projeto_equipe (
  id            uuid primary key default gen_random_uuid(),
  projeto_id    uuid not null references public.projetos(id) on delete cascade,
  usuario_id    uuid not null references public.usuarios(id),
  papel         text
                  constraint chk_equipe_papel check (
                    papel in ('arquiteto_responsavel','arquiteto_colaborador',
                              'designer_interiores','paisagista',
                              'engenheiro_consultor','estagiario')
                  ),
  data_entrada  date not null default current_date,
  data_saida    date,

  constraint uq_projeto_usuario unique (projeto_id, usuario_id)
);

comment on table public.projeto_equipe is
  'Equipe interna alocada em cada projeto (relação muitos-para-muitos).';


-- ---------------------------------------------------------------------
-- 3.4 projeto_links
-- Links para pastas/arquivos na nuvem (Drive, Dropbox, etc). Tabela
-- separada (em vez de uma coluna única) porque um projeto normalmente
-- tem mais de um link — plantas, renders, fotos de obra, contratos.
-- ---------------------------------------------------------------------
create table public.projeto_links (
  id           uuid primary key default gen_random_uuid(),
  projeto_id   uuid not null references public.projetos(id) on delete cascade,
  tipo_link    text not null default 'pasta_geral'
                 constraint chk_links_tipo check (
                   tipo_link in ('pasta_geral','plantas','renders_3d',
                                 'fotos_obra','moodboard','outro')
                 ),
  url          text not null,
  descricao    text,
  created_at   timestamptz not null default now()
);

comment on table public.projeto_links is
  'Links para pastas na nuvem associadas ao projeto (Drive, Dropbox, etc).';


-- =====================================================================
-- 4. MÓDULO 3 — FINANCEIRO E CONTRATOS (ADMINISTRATIVO)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 4.1 minutas_contratuais
-- Documentos em elaboração/revisão jurídica, antes de virarem contrato
-- assinado.
-- ---------------------------------------------------------------------
create table public.minutas_contratuais (
  id                uuid primary key default gen_random_uuid(),
  projeto_id        uuid not null references public.projetos(id) on delete cascade,
  cliente_id        uuid not null references public.clientes(id),
  tipo_documento    text not null default 'contrato_honorarios'
                      constraint chk_minutas_tipo check (
                        tipo_documento in ('contrato_honorarios','termo_aditivo','nda',
                                           'distrato','outro')
                      ),
  versao            smallint not null default 1,
  status            text not null default 'em_elaboracao'
                      constraint chk_minutas_status check (
                        status in ('em_elaboracao','em_revisao_juridica',
                                   'aguardando_aprovacao_cliente','aprovada',
                                   'convertida_em_contrato','descartada')
                      ),
  responsavel_id    uuid references public.usuarios(id),
  url_arquivo       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

comment on table public.minutas_contratuais is
  'Minutas em elaboração/revisão jurídica, anteriores à assinatura do contrato.';


-- ---------------------------------------------------------------------
-- 4.2 contratos
-- ---------------------------------------------------------------------
create table public.contratos (
  id                  uuid primary key default gen_random_uuid(),
  projeto_id          uuid not null references public.projetos(id),
  cliente_id          uuid not null references public.clientes(id),
  minuta_origem_id    uuid references public.minutas_contratuais(id),

  numero_contrato     text unique,
  valor_honorarios    numeric(14,2) not null constraint chk_contratos_valor check (valor_honorarios >= 0),
  forma_pagamento     text not null default 'parcelado'
                        constraint chk_contratos_forma_pagamento check (
                          forma_pagamento in ('a_vista','parcelado','por_etapa')
                        ),
  numero_parcelas     smallint,

  data_assinatura     date,
  status              text not null default 'aguardando_assinatura'
                        constraint chk_contratos_status check (
                          status in ('aguardando_assinatura','assinado','em_vigor',
                                     'encerrado','cancelado')
                        ),

  url_arquivo         text,
  responsavel_id      uuid references public.usuarios(id),

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);

comment on table public.contratos is
  'Contratos de honorários assinados (ou aguardando assinatura), vinculados a um projeto.';


-- ---------------------------------------------------------------------
-- 4.3 faturas
-- Uma linha por cobrança/parcela — é a peça central do fluxo de
-- pagamentos que o Financeiro acompanha no dia a dia.
-- ---------------------------------------------------------------------
create table public.faturas (
  id                 uuid primary key default gen_random_uuid(),
  contrato_id        uuid not null references public.contratos(id) on delete cascade,

  numero_fatura      text,
  descricao          text not null,      -- ex: 'Parcela 2/6 — Anteprojeto'
  valor              numeric(14,2) not null constraint chk_faturas_valor check (valor > 0),

  data_emissao       date not null default current_date,
  data_vencimento    date not null,
  data_pagamento     date,

  forma_pagamento    text
                       constraint chk_faturas_forma_pagamento check (
                         forma_pagamento in ('pix','boleto','transferencia','cartao')
                       ),
  status             text not null default 'pendente'
                       constraint chk_faturas_status check (
                         status in ('pendente','paga','atrasada','cancelada')
                       ),

  observacoes        text,

  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

comment on table public.faturas is
  'Faturas/parcelas de cobrança vinculadas a um contrato — base do fluxo de pagamentos.';


-- =====================================================================
-- 5. FUNÇÕES E TRIGGERS DE APOIO
-- =====================================================================

-- Atualiza updated_at automaticamente a cada UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_usuarios_updated_at            before update on public.usuarios            for each row execute function public.set_updated_at();
create trigger trg_clientes_updated_at            before update on public.clientes            for each row execute function public.set_updated_at();
create trigger trg_projetos_updated_at            before update on public.projetos            for each row execute function public.set_updated_at();
create trigger trg_projeto_etapas_updated_at      before update on public.projeto_etapas      for each row execute function public.set_updated_at();
create trigger trg_minutas_updated_at             before update on public.minutas_contratuais for each row execute function public.set_updated_at();
create trigger trg_contratos_updated_at           before update on public.contratos           for each row execute function public.set_updated_at();
create trigger trg_faturas_updated_at             before update on public.faturas             for each row execute function public.set_updated_at();


-- =====================================================================
-- 6. ÍNDICES
-- =====================================================================

-- CRM
create index idx_clientes_status_prospeccao on public.clientes (status_prospeccao) where deleted_at is null;
create index idx_clientes_responsavel       on public.clientes (responsavel_id);
create index idx_clientes_data_nascimento   on public.clientes (data_nascimento);  -- painel de aniversários
create index idx_interacoes_cliente         on public.clientes_interacoes (cliente_id, data_interacao desc);

-- Projetos
create index idx_projetos_cliente           on public.projetos (cliente_id);
create index idx_projetos_status            on public.projetos (status) where deleted_at is null;
create index idx_projeto_etapas_projeto     on public.projeto_etapas (projeto_id, ordem);
create index idx_projeto_equipe_usuario     on public.projeto_equipe (usuario_id);

-- Financeiro
create index idx_contratos_projeto          on public.contratos (projeto_id);
create index idx_contratos_status           on public.contratos (status) where deleted_at is null;
create index idx_faturas_contrato           on public.faturas (contrato_id);
create index idx_faturas_status_vencimento  on public.faturas (status, data_vencimento);  -- consulta mais usada no painel


-- =====================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ---------------------------------------------------------------------
-- Regra geral: qualquer usuário autenticado (equipe interna) pode ler e
-- escrever, EXCETO quando o registro (ou o projeto ao qual ele pertence)
-- está marcado como nivel_sigilo = 'confidencial' — nesse caso, só o
-- responsável direto ou um usuário com pode_ver_confidencial = true
-- enxerga a linha.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 7.1 Funções auxiliares
-- ---------------------------------------------------------------------

-- A flag pode_ver_confidencial do usuário autenticado no momento.
create or replace function public.eh_usuario_confidencial()
returns boolean
language sql
stable
as $$
  select coalesce(
    (select pode_ver_confidencial from public.usuarios where id = auth.uid()),
    false
  );
$$;

-- Um projeto é visível se não for confidencial, ou se o usuário atual
-- for o arquiteto responsável, ou se tiver a flag de confidencial.
create or replace function public.projeto_e_visivel(p_projeto_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.projetos p
    where p.id = p_projeto_id
      and (
        p.nivel_sigilo = 'normal'
        or p.arquiteto_responsavel_id = auth.uid()
        or public.eh_usuario_confidencial()
      )
  );
$$;

-- Mesma lógica, partindo de um contrato (usado pela tabela faturas).
create or replace function public.contrato_e_visivel(p_contrato_id uuid)
returns boolean
language sql
stable
as $$
  select public.projeto_e_visivel(c.projeto_id)
  from public.contratos c
  where c.id = p_contrato_id;
$$;

-- ---------------------------------------------------------------------
-- 7.2 Habilitar RLS em todas as tabelas
-- ---------------------------------------------------------------------
alter table public.usuarios                    enable row level security;
alter table public.clientes                    enable row level security;
alter table public.clientes_contatos_adicionais enable row level security;
alter table public.clientes_interacoes         enable row level security;
alter table public.projetos                    enable row level security;
alter table public.projeto_etapas              enable row level security;
alter table public.projeto_equipe              enable row level security;
alter table public.projeto_links               enable row level security;
alter table public.minutas_contratuais         enable row level security;
alter table public.contratos                   enable row level security;
alter table public.faturas                     enable row level security;

-- ---------------------------------------------------------------------
-- 7.3 Policies — usuarios
-- ---------------------------------------------------------------------
create policy "usuarios_select_autenticado" on public.usuarios
  for select to authenticated using (true);

create policy "usuarios_update_proprio_registro" on public.usuarios
  for update to authenticated using (id = auth.uid());

-- ---------------------------------------------------------------------
-- 7.4 Policies — clientes (respeitam nivel_sigilo)
-- ---------------------------------------------------------------------
create policy "clientes_select" on public.clientes
  for select to authenticated using (
    nivel_sigilo = 'normal'
    or responsavel_id = auth.uid()
    or public.eh_usuario_confidencial()
  );

create policy "clientes_insert" on public.clientes
  for insert to authenticated with check (true);

create policy "clientes_update" on public.clientes
  for update to authenticated using (
    nivel_sigilo = 'normal'
    or responsavel_id = auth.uid()
    or public.eh_usuario_confidencial()
  );

-- Tabelas filhas de clientes herdam a mesma regra de visibilidade.
create policy "clientes_contatos_select" on public.clientes_contatos_adicionais
  for select to authenticated using (
    exists (
      select 1 from public.clientes c
      where c.id = cliente_id
        and (c.nivel_sigilo = 'normal' or c.responsavel_id = auth.uid() or public.eh_usuario_confidencial())
    )
  );
create policy "clientes_contatos_insert" on public.clientes_contatos_adicionais
  for insert to authenticated with check (true);

create policy "clientes_interacoes_select" on public.clientes_interacoes
  for select to authenticated using (
    exists (
      select 1 from public.clientes c
      where c.id = cliente_id
        and (c.nivel_sigilo = 'normal' or c.responsavel_id = auth.uid() or public.eh_usuario_confidencial())
    )
  );
create policy "clientes_interacoes_insert" on public.clientes_interacoes
  for insert to authenticated with check (true);

-- ---------------------------------------------------------------------
-- 7.5 Policies — projetos e tabelas filhas
-- ---------------------------------------------------------------------
create policy "projetos_select" on public.projetos
  for select to authenticated using (
    nivel_sigilo = 'normal'
    or arquiteto_responsavel_id = auth.uid()
    or public.eh_usuario_confidencial()
  );

create policy "projetos_insert" on public.projetos
  for insert to authenticated with check (true);

create policy "projetos_update" on public.projetos
  for update to authenticated using (
    nivel_sigilo = 'normal'
    or arquiteto_responsavel_id = auth.uid()
    or public.eh_usuario_confidencial()
  );

create policy "projeto_etapas_select" on public.projeto_etapas
  for select to authenticated using (public.projeto_e_visivel(projeto_id));
create policy "projeto_etapas_write" on public.projeto_etapas
  for all to authenticated using (public.projeto_e_visivel(projeto_id)) with check (public.projeto_e_visivel(projeto_id));

create policy "projeto_equipe_select" on public.projeto_equipe
  for select to authenticated using (public.projeto_e_visivel(projeto_id));
create policy "projeto_equipe_write" on public.projeto_equipe
  for all to authenticated using (public.projeto_e_visivel(projeto_id)) with check (public.projeto_e_visivel(projeto_id));

create policy "projeto_links_select" on public.projeto_links
  for select to authenticated using (public.projeto_e_visivel(projeto_id));
create policy "projeto_links_write" on public.projeto_links
  for all to authenticated using (public.projeto_e_visivel(projeto_id)) with check (public.projeto_e_visivel(projeto_id));

-- ---------------------------------------------------------------------
-- 7.6 Policies — financeiro e contratos
-- ---------------------------------------------------------------------
create policy "minutas_select" on public.minutas_contratuais
  for select to authenticated using (public.projeto_e_visivel(projeto_id));
create policy "minutas_write" on public.minutas_contratuais
  for all to authenticated using (public.projeto_e_visivel(projeto_id)) with check (public.projeto_e_visivel(projeto_id));

create policy "contratos_select" on public.contratos
  for select to authenticated using (public.projeto_e_visivel(projeto_id));
create policy "contratos_write" on public.contratos
  for all to authenticated using (public.projeto_e_visivel(projeto_id)) with check (public.projeto_e_visivel(projeto_id));

create policy "faturas_select" on public.faturas
  for select to authenticated using (public.contrato_e_visivel(contrato_id));
create policy "faturas_write" on public.faturas
  for all to authenticated using (public.contrato_e_visivel(contrato_id)) with check (public.contrato_e_visivel(contrato_id));

-- =====================================================================
-- FIM DO SCHEMA
-- =====================================================================
