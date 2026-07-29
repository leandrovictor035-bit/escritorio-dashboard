-- =====================================================================
-- RBAC — ADMIN FINANCEIRO
-- Adiciona a flag de acesso ao painel de Gestão Administrativa e
-- substitui as policies de RLS do módulo financeiro.
--
-- Correção importante: as policies criadas no schema original
-- (minutas_select/write, contratos_select/write, faturas_select/write)
-- liberavam QUALQUER usuário autenticado cujo projeto fosse visível
-- (projeto_e_visivel). Isso inclui a equipe de criação — exatamente o
-- que este painel precisa impedir. As novas policies abaixo restringem
-- essas três tabelas exclusivamente a usuarios.eh_admin_financeiro = true.
-- =====================================================================

alter table public.usuarios
  add column eh_admin_financeiro boolean not null default false;

comment on column public.usuarios.eh_admin_financeiro is
  'Acesso ao painel de Gestão Administrativa (financeiro/contratual). Independente do cargo — um sócio ou arquiteto não tem essa flag por padrão.';

-- Exemplo — ajustar para o e-mail/id real da Bárbara:
-- update public.usuarios set eh_admin_financeiro = true where email = 'barbara@escritorio.com.br';

-- ---------------------------------------------------------------------
-- Função auxiliar de RLS
-- ---------------------------------------------------------------------
create or replace function public.eh_admin_financeiro()
returns boolean
language sql
stable
as $$
  select coalesce(
    (select eh_admin_financeiro from public.usuarios where id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------------
-- Substituição das policies de minutas_contratuais / contratos / faturas
-- ---------------------------------------------------------------------
drop policy if exists "minutas_select" on public.minutas_contratuais;
drop policy if exists "minutas_write"  on public.minutas_contratuais;
create policy "minutas_admin_financeiro" on public.minutas_contratuais
  for all to authenticated
  using (public.eh_admin_financeiro())
  with check (public.eh_admin_financeiro());

drop policy if exists "contratos_select" on public.contratos;
drop policy if exists "contratos_write"  on public.contratos;
create policy "contratos_admin_financeiro" on public.contratos
  for all to authenticated
  using (public.eh_admin_financeiro())
  with check (public.eh_admin_financeiro());

drop policy if exists "faturas_select" on public.faturas;
drop policy if exists "faturas_write"  on public.faturas;
create policy "faturas_admin_financeiro" on public.faturas
  for all to authenticated
  using (public.eh_admin_financeiro())
  with check (public.eh_admin_financeiro());

-- Observação: projetos e etapas continuam visíveis para a equipe de
-- criação (regra de nivel_sigilo de sempre) — só o CONTEÚDO financeiro
-- (minuta, contrato, fatura) é que fica exclusivo da Bárbara. Isso é
-- proposital: um arquiteto precisa ver que existe um contrato associado
-- ao projeto, mas não o valor de honorários ou o fluxo de pagamento.
