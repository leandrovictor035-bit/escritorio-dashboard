import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // Chamado a partir de um Server Component sem permissão de
            // escrita — inofensivo, o middleware renova a sessão.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch {
            // Idem acima.
          }
        },
      },
    }
  );
}
