import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PlatformApp from '@/components/PlatformApp';

export default async function HomePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: perfil } = await supabase
    .from('usuarios')
    .select('nome_completo, cargo, eh_admin_financeiro')
    .eq('id', user.id)
    .single();

  return (
    <PlatformApp
      usuario={{
        nome: perfil?.nome_completo || user.email,
        cargo: perfil?.cargo || '',
        ehAdminFinanceiro: perfil?.eh_admin_financeiro || false,
      }}
    />
  );
}
