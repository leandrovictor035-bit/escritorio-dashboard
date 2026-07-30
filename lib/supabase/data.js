import { createClient } from './client';

// Converte chaves entre os dois padrões — assim cada tabela nova não
// exige escrever um mapeamento manual campo a campo.
function paraSnakeCase(chave) {
  return chave.replace(/[A-Z]/g, (letra) => '_' + letra.toLowerCase());
}
function paraCamelCase(chave) {
  return chave.replace(/_([a-z])/g, (_, letra) => letra.toUpperCase());
}
function linhaParaObjeto(linha) {
  const objeto = {};
  for (const [chave, valor] of Object.entries(linha)) objeto[paraCamelCase(chave)] = valor;
  return objeto;
}
function objetoParaLinha(objeto) {
  const linha = {};
  for (const [chave, valor] of Object.entries(objeto)) {
    if (chave === 'id') continue; // o banco gera o id — nunca mandamos um id de cliente
    linha[paraSnakeCase(chave)] = valor;
  }
  return linha;
}

async function listar(tabela, ordenarPor = 'created_at') {
  const supabase = createClient();
  const { data, error } = await supabase.from(tabela).select('*').order(ordenarPor, { ascending: true });
  if (error) throw error;
  return (data || []).map(linhaParaObjeto);
}

async function inserir(tabela, objeto) {
  const supabase = createClient();
  const { data, error } = await supabase.from(tabela).insert(objetoParaLinha(objeto)).select().single();
  if (error) throw error;
  return linhaParaObjeto(data);
}

async function atualizar(tabela, id, patch) {
  const supabase = createClient();
  const { data, error } = await supabase.from(tabela).update(objetoParaLinha(patch)).eq('id', id).select().single();
  if (error) throw error;
  return linhaParaObjeto(data);
}

async function excluir(tabela, id) {
  const supabase = createClient();
  const { error } = await supabase.from(tabela).delete().eq('id', id);
  if (error) throw error;
}

export const dataApi = {
  clientes: {
    listar: () => listar('clientes'),
    inserir: (c) => inserir('clientes', c),
    excluir: (id) => excluir('clientes', id),
  },
  projetos: {
    listar: () => listar('projetos'),
    inserir: (p) => inserir('projetos', p),
    atualizar: (id, patch) => atualizar('projetos', id, patch),
  },
  demandas: {
    listar: () => listar('demandas'),
    inserir: (d) => inserir('demandas', d),
    atualizar: (id, patch) => atualizar('demandas', id, patch),
    excluir: (id) => excluir('demandas', id),
  },
  contratos: {
    listar: () => listar('contratos'),
    inserir: (c) => inserir('contratos', c),
  },
  parcerias: {
    listar: () => listar('parcerias'),
    inserir: (p) => inserir('parcerias', p),
  },
  orcamentos: {
    listar: () => listar('orcamentos'),
    inserir: (o) => inserir('orcamentos', o),
  },
  equipe: {
    listar: () => listar('equipe'),
    inserir: (m) => inserir('equipe', m),
  },
  notificacoes: {
    listar: () => listar('notificacoes'),
    inserir: (n) => inserir('notificacoes', n),
    marcarTodasLidas: async () => {
      const supabase = createClient();
      const { error } = await supabase.from('notificacoes').update({ lida: true }).eq('lida', false);
      if (error) throw error;
    },
  },
};
