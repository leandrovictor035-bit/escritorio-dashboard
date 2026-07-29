# Escritório — Plataforma interna

Siga esta ordem exata. Cada etapa depende da anterior.

## 1. Banco de dados e login (Supabase)

1. Crie uma conta em **supabase.com** → **New project**. Anote a senha do banco que ele pedir.
2. Abra o **SQL Editor** (menu lateral) e rode, **nesta ordem**, o conteúdo de cada arquivo:
   - `supabase/001_schema.sql`
   - `supabase/002_rbac_financeiro.sql`
3. Crie o primeiro usuário: **Authentication → Users → Add user** → preencha e-mail e senha (essa será a senha de login da pessoa no site).
4. Volte ao **SQL Editor** e vincule esse usuário à tabela de negócio (troque o e-mail pelo que você cadastrou):
   ```sql
   insert into public.usuarios (id, nome_completo, email, cargo, eh_admin_financeiro)
   select id, 'Bárbara Silva', email, 'financeiro', true
   from auth.users
   where email = 'barbara@seudominio.com.br';
   ```
   Repita para cada pessoa da equipe (ajuste `cargo` e deixe `eh_admin_financeiro` como `false` para quem não deve ver o Financeiro).
5. Em **Project Settings → API**, copie a **Project URL** e a **anon public key** — vai precisar delas nos dois próximos passos.

## 2. Rodar localmente (opcional, para testar antes de publicar)

```bash
cp .env.local.example .env.local
# edite .env.local e cole a URL e a chave do passo 1.5

npm install
npm run dev
```
Acesse `http://localhost:3000` e faça login com o usuário criado no passo 1.3.

## 3. Subir para o GitHub

1. Crie uma conta em **github.com** (se ainda não tiver).
2. Crie um repositório novo (**New repository**), vazio, sem README.
3. Dentro da pasta deste projeto:
   ```bash
   git init
   git add .
   git commit -m "Primeira versão"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

## 4. Deploy no Vercel

1. Crie uma conta em **vercel.com** com **Continue with GitHub**.
2. **Add New → Project** → selecione o repositório que você acabou de subir.
3. Em **Environment Variables**, adicione as duas mesmas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. Em ~1 minuto você tem uma URL tipo `seu-projeto.vercel.app`, já funcionando com login de verdade.

## 5. Conectar seu domínio próprio

1. No projeto, dentro do Vercel: **Settings → Domains → Add**.
2. Digite seu domínio (ex: `painel.seudominio.com.br`).
3. O Vercel mostra um ou dois registros de DNS (tipo `CNAME` ou `A`) para você adicionar.
4. Vá até onde você registrou o domínio (Registro.br, GoDaddy, Hostgator, etc.) → área de **DNS** → adicione exatamente os registros que o Vercel mostrou.
5. Aguarde a propagação (de minutos a algumas horas). O Vercel emite HTTPS automaticamente assim que detectar o DNS certo.

## O que ainda é simplificado (próximos passos naturais)

- **Dados são mock em memória** dentro de `components/PlatformApp.jsx` — cadastros feitos no site não persistem ainda. O próximo passo é trocar cada `useState` inicial por uma consulta real ao Supabase (`supabase.from('clientes').select('*')` etc.) — o schema já está pronto para isso.
- **RBAC do Financeiro é só de interface** neste bridge (o menu se esconde, mas a rota `/` é uma única página). Para o mesmo nível de segurança que fizemos antes (checagem no servidor + RLS), o Financeiro precisa virar uma rota própria server-rendered — o código disso já existe em versões anteriores desta conversa e pode ser replugado quando for a hora.
