import './globals.css';

export const metadata = {
  title: 'Painel geral — Escritório de Arquitetura',
  description: 'Plataforma interna de gestão',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
