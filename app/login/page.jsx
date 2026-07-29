'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { tokens } from '@/lib/designTokens';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setCarregando(false);

    if (error) {
      setErro('E-mail ou senha inválidos.');
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tokens.bg, fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        input { font-family: 'Manrope', sans-serif; }
      `}</style>

      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360, background: tokens.surface, border: `1px solid ${tokens.border}`, padding: 36 }}>
        <h1 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 300, color: tokens.graphite900 }}>Entrar</h1>
        <p style={{ margin: '0 0 28px', fontSize: 13, color: tokens.graphite600 }}>Plataforma interna do escritório</p>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.graphite600 }}>E-mail</span>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '10px 12px', fontSize: 13, color: tokens.graphite900, border: `1px solid ${tokens.border}`, outline: 'none', background: 'transparent' }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.graphite600 }}>Senha</span>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ padding: '10px 12px', fontSize: 13, color: tokens.graphite900, border: `1px solid ${tokens.border}`, outline: 'none', background: 'transparent' }}
          />
        </label>

        {erro && <p style={{ margin: '0 0 16px', fontSize: 12, color: tokens.alert }}>{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          style={{ width: '100%', padding: '11px', fontSize: 13, letterSpacing: '0.02em', background: tokens.graphite900, color: tokens.bg, border: 'none', cursor: carregando ? 'default' : 'pointer', opacity: carregando ? 0.6 : 1 }}
        >
          {carregando ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
