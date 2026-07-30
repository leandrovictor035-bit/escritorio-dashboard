'use client';

import React, { useState, useEffect } from 'react';
import { dataApi } from '@/lib/supabase/data';
import { tokens } from '@/lib/designTokens';
import {
  LayoutGrid, Users, Building2, Wallet, AlertTriangle, Clock3,
  Plus, X, Check, ShieldCheck, GripVertical, UserPlus, ClipboardList,
  Trash2, Handshake, FileText, Contact, Bell, ArrowLeft, Paperclip,
} from 'lucide-react';

const LOGO_SRC = "data:image/png;base64,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";

const inputStyle = { padding: '9px 12px', fontSize: 13, background: 'transparent', outline: 'none', color: tokens.graphite900, width: '100%' };

const NAV_ITEMS = [
  { key: 'painel', label: 'Painel geral', icon: LayoutGrid },
  { key: 'clientes', label: 'Clientes', icon: Users },
  { key: 'projetos', label: 'Projetos', icon: Building2 },
  { key: 'demandas', label: 'Demandas', icon: ClipboardList },
  { key: 'parcerias', label: 'Parcerias', icon: Handshake },
  { key: 'orcamentos', label: 'Orçamentos', icon: FileText },
  { key: 'equipe', label: 'Equipe', icon: Contact },
  { key: 'financeiro', label: 'Financeiro', icon: Wallet },
];

const PHASES = [
  { key: 'briefing_receptivo', label: 'Briefing / Receptivo', ordem: 1 },
  { key: 'estudo_preliminar', label: 'Estudo Preliminar', ordem: 2 },
  { key: 'anteprojeto', label: 'Anteprojeto', ordem: 3 },
  { key: 'projeto_executivo', label: 'Projeto Executivo', ordem: 4 },
  { key: 'detalhamento', label: 'Detalhamento', ordem: 5 },
  { key: 'acompanhamento_obra', label: 'Acompanhamento de Obra', ordem: 6 },
];

const STATUS_PROSPECCAO_LABEL = {
  lead: 'Lead',
  em_qualificacao: 'Em qualificação',
  proposta_enviada: 'Proposta enviada',
  negociacao: 'Negociação',
  cliente_ativo: 'Cliente ativo',
  cliente_inativo: 'Cliente inativo',
  perdido: 'Perdido',
};

const CARGOS_EQUIPE = ['Sócio', 'Arquiteto Sênior', 'Arquiteto Júnior', 'Designer de Interiores', 'Estagiário', 'Administrativo', 'Financeiro'];

// ---------------------------------------------------------------------
// gerarParcelas — usada pelo formulário de Novo Contrato para calcular
// as parcelas automaticamente antes de enviar ao banco.
// ---------------------------------------------------------------------

function gerarParcelas(valorTotal, numeroParcelas, dataInicio) {
  const valor = Math.round(valorTotal / numeroParcelas);
  const inicio = new Date(dataInicio + 'T00:00:00');
  const parcelas = [];
  for (let i = 0; i < numeroParcelas; i++) {
    const venc = new Date(inicio);
    venc.setMonth(venc.getMonth() + i);
    parcelas.push({ numero: i + 1, valor, vencimento: venc.toISOString().slice(0, 10) });
  }
  return parcelas;
}

// Aprovação de minutas ainda não foi conectada ao banco nesta rodada —
// segue como mock local, sinalizado explicitamente para não confundir
// com o restante (que já persiste de verdade).
const minutasMockInicial = [];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function calcularUrgenciaPrazo(prazoISO) {
  if (!prazoISO) return { nivel: 'sem_prazo', dias: null };
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const prazo = new Date(prazoISO + 'T00:00:00');
  const dias = Math.round((prazo - hoje) / 86400000);
  if (dias < 0) return { nivel: 'atrasado', dias };
  if (dias <= 7) return { nivel: 'proximo', dias };
  return { nivel: 'ok', dias };
}

const formatarMoeda = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v || 0);

const formatarData = (iso) => (iso ? new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR') : '—');

function dataDeHojeISO() {
  const hoje = new Date();
  return hoje.toISOString().slice(0, 10);
}

// Formata progressivamente enquanto o usuário digita: 000.000.000-00
function formatarCPF(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length > 9) return digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  if (digitos.length > 6) return digitos.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  if (digitos.length > 3) return digitos.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  return digitos;
}

// Formata progressivamente: 00.000.000/0000-00
function formatarCNPJ(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 14);
  if (digitos.length > 12) return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
  if (digitos.length > 8) return digitos.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
  if (digitos.length > 5) return digitos.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
  if (digitos.length > 2) return digitos.replace(/(\d{2})(\d{1,3})/, '$1.$2');
  return digitos;
}

// Formata progressivamente: 00000-000
function formatarCEP(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  if (digitos.length > 5) return digitos.replace(/(\d{5})(\d{1,3})/, '$1-$2');
  return digitos;
}

function calcularFluxoPorCliente(contratos) {
  const hojeISO = dataDeHojeISO();
  const mapa = {};
  contratos.forEach((c) => {
    if (!mapa[c.cliente]) mapa[c.cliente] = { cliente: c.cliente, contratado: 0, recebido: 0, pendente: 0, proximoVencimento: null };
    mapa[c.cliente].contratado += c.honorarios;
    (c.parcelas || []).forEach((p) => {
      if (p.vencimento < hojeISO) {
        mapa[c.cliente].recebido += p.valor;
      } else {
        mapa[c.cliente].pendente += p.valor;
        if (!mapa[c.cliente].proximoVencimento || p.vencimento < mapa[c.cliente].proximoVencimento) {
          mapa[c.cliente].proximoVencimento = p.vencimento;
        }
      }
    });
  });
  return Object.values(mapa);
}

function calcularPanoramaMensal(contratos) {
  const mapa = {};
  contratos.forEach((c) => {
    (c.parcelas || []).forEach((p) => {
      const chave = p.vencimento.slice(0, 7);
      mapa[chave] = (mapa[chave] || 0) + p.valor;
    });
  });
  return Object.entries(mapa)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([chave, total]) => ({
      chave,
      total,
      label: new Date(chave + '-01T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
    }));
}

function contarAniversariosProximos(clientes, dias = 7) {
  return listarAniversariosProximos(clientes, dias).length;
}

// Retorna clientes com aniversário nos próximos `dias`, já ordenados
// pela proximidade — usado no Painel geral para listar (não só contar).
function listarAniversariosProximos(clientes, dias = 7) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return clientes
    .filter((c) => c.aniversario)
    .map((c) => {
      const [, mes, dia] = c.aniversario.split('-').map(Number);
      const proximo = new Date(hoje.getFullYear(), mes - 1, dia);
      if (proximo < hoje) proximo.setFullYear(hoje.getFullYear() + 1);
      const diasRestantes = Math.round((proximo - hoje) / 86400000);
      return { nome: c.nome, aniversario: c.aniversario, diasRestantes };
    })
    .filter((c) => c.diasRestantes >= 0 && c.diasRestantes <= dias)
    .sort((a, b) => a.diasRestantes - b.diasRestantes);
}

// Estados (UF) onde já há cliente cadastrado — cresce conforme o
// cadastro avança.
function calcularEstadosAtuacao(clientes) {
  const estados = new Set(clientes.map((c) => (c.estado || '').trim().toUpperCase()).filter(Boolean));
  return Array.from(estados).sort();
}

// Ganho total por cliente = honorários dos contratos + comissões de
// parcerias vinculadas a ele. É a automação pedida para enxergar o
// resultado de cada cliente além do valor do contrato.
function calcularGanhoPorCliente(clienteId, contratos, parcerias) {
  const totalContratos = contratos.filter((c) => c.clienteId === clienteId).reduce((s, c) => s + c.honorarios, 0);
  const totalParcerias = parcerias
    .filter((p) => p.clienteId === clienteId)
    .reduce((s, p) => s + p.parcelas.reduce((s2, pc) => s2 + pc.valor, 0), 0);
  return totalContratos + totalParcerias;
}

function totalParceria(parceria) {
  return parceria.parcelas.reduce((s, p) => s + p.valor, 0);
}

function proximoPagamentoParceria(parceria) {
  const hojeISO = dataDeHojeISO();
  const futuras = parceria.parcelas.filter((p) => p.data >= hojeISO).sort((a, b) => a.data.localeCompare(b.data));
  return futuras.length > 0 ? futuras[0].data : null;
}

// ---------------------------------------------------------------------
// Componentes de apoio
// ---------------------------------------------------------------------

function TopBar({ eyebrow, titulo, acao }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, borderBottom: `1px solid ${tokens.border}`, paddingBottom: 24, marginBottom: 36, flexWrap: 'wrap' }}>
      <div>
        <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: tokens.graphite600 }}>{eyebrow}</p>
        <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 300, letterSpacing: '-0.01em', color: tokens.graphite900 }}>{titulo}</h1>
      </div>
      {acao}
    </div>
  );
}

function StatCard({ label, valor, Icon, tone }) {
  return (
    <div className="hairline" style={{ position: 'relative', background: tokens.surface, padding: '22px 20px 18px' }}>
      <span style={{ position: 'absolute', left: 0, top: 0, width: 10, height: 10, borderLeft: `1px solid ${tokens.chromeAccent}`, borderTop: `1px solid ${tokens.chromeAccent}` }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span className="font-mono" style={{ fontSize: 28, fontWeight: 300, lineHeight: 1, color: tokens.graphite900 }}>{valor}</span>
        {Icon && <Icon size={16} strokeWidth={1.5} color={tone === 'alert' ? tokens.alert : tokens.graphite600} />}
      </div>
      <div style={{ marginTop: 12, height: 1, background: tokens.border }} />
      <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: tokens.graphite600 }}>{label}</p>
    </div>
  );
}

function Badge({ children, tone = 'neutral' }) {
  const estilos = {
    neutral: { background: tokens.surfaceAlt, color: tokens.graphite800 },
    alert: { background: tokens.alertSoft, color: tokens.alert },
    chrome: { background: tokens.surfaceAlt, color: tokens.graphite700 },
    ghost: { background: 'transparent', color: tokens.graphite600 },
  };
  return (
    <span className="font-mono" style={{ padding: '4px 10px', fontSize: 11, letterSpacing: '0.02em', whiteSpace: 'nowrap', width: 'fit-content', ...estilos[tone] }}>
      {children}
    </span>
  );
}

function EmptyState({ titulo, acaoLabel, onAcao }) {
  return (
    <div className="hairline" style={{ background: tokens.surface, padding: '40px 24px', textAlign: 'center' }}>
      <p style={{ margin: 0, fontSize: 13, color: tokens.graphite600 }}>{titulo}</p>
      {acaoLabel && onAcao && (
        <button
          onClick={onAcao}
          style={{ marginTop: 14, background: 'transparent', border: 'none', color: tokens.chromeAccent, fontSize: 13, cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          {acaoLabel}
        </button>
      )}
    </div>
  );
}

function Botao({ children, variante = 'primary', onClick, type = 'button' }) {
  return (
    <button type={type} className={variante === 'primary' ? 'btn-primary' : 'btn-secondary'} onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 13, letterSpacing: '0.02em' }}>
      {children}
    </button>
  );
}

function Campo({ label, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.graphite600 }}>{label}</span>
      {children}
    </label>
  );
}

// onSubmit (opcional): quando informado, o conteúdo do modal fica dentro
// de um <form>, então apertar Enter em qualquer campo já confirma o
// cadastro — sem precisar clicar no botão.
function ModalBase({ titulo, onFechar, children, largura = 460, onSubmit }) {
  const cabecalhoEConteudo = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 300, color: tokens.graphite900 }}>{titulo}</h2>
        <X size={18} strokeWidth={1.5} color={tokens.graphite600} style={{ cursor: 'pointer' }} onClick={onFechar} />
      </div>
      {children}
    </>
  );

  return (
    <div onClick={onFechar} style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(26,27,30,0.4)', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="hairline" style={{ width: '100%', maxWidth: largura, maxHeight: '85vh', overflowY: 'auto', background: tokens.surface, padding: 32 }}>
        {onSubmit ? (
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>{cabecalhoEConteudo}</form>
        ) : (
          cabecalhoEConteudo
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Modais de cadastro
// ---------------------------------------------------------------------

function NovoClienteModal({ onFechar, onSalvar }) {
  const [form, setForm] = useState({
    tipo: 'PF', nome: '', documento: '', email: '', telefone: '', aniversario: '',
    rua: '', numero: '', complemento: '', bairro: '', cep: '', estado: '',
  });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function trocarTipo(novoTipo) {
    setForm((f) => ({ ...f, tipo: novoTipo, documento: '' }));
  }

  function salvar() {
    if (!form.nome.trim()) return;
    onSalvar({
      id: `cl-${Date.now()}`,
      nome: form.nome,
      tipo: form.tipo,
      documento: form.documento,
      email: form.email,
      telefone: form.telefone,
      aniversario: form.aniversario,
      rua: form.rua,
      numero: form.numero,
      complemento: form.complemento,
      bairro: form.bairro,
      cep: form.cep,
      estado: form.estado.toUpperCase(),
      nivel: 'Standard',
      status: 'lead',
      responsavel: 'Você',
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Novo cliente" onFechar={onFechar} largura={540} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Tipo de pessoa">
          <div className="hairline" style={{ display: 'flex' }}>
            <button
              type="button"
              onClick={() => trocarTipo('PF')}
              style={{
                flex: 1, padding: '9px 12px', fontSize: 13, cursor: 'pointer', border: 'none',
                background: form.tipo === 'PF' ? tokens.graphite900 : 'transparent',
                color: form.tipo === 'PF' ? tokens.bg : tokens.graphite700,
              }}
            >
              Pessoa física
            </button>
            <button
              type="button"
              onClick={() => trocarTipo('PJ')}
              style={{
                flex: 1, padding: '9px 12px', fontSize: 13, cursor: 'pointer', borderTop: 'none', borderBottom: 'none', borderRight: 'none',
                borderLeft: `1px solid ${tokens.border}`,
                background: form.tipo === 'PJ' ? tokens.graphite900 : 'transparent',
                color: form.tipo === 'PJ' ? tokens.bg : tokens.graphite700,
              }}
            >
              Pessoa jurídica
            </button>
          </div>
        </Campo>

        <Campo label="Nome">
          <input
            className="hairline"
            style={inputStyle}
            value={form.nome}
            onChange={(e) => atualizar('nome', e.target.value)}
            placeholder={form.tipo === 'PJ' ? 'Razão social' : 'Nome completo'}
          />
        </Campo>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label={form.tipo === 'PJ' ? 'CNPJ' : 'CPF'}>
            <input
              className="hairline"
              style={inputStyle}
              value={form.documento}
              onChange={(e) => atualizar('documento', form.tipo === 'PJ' ? formatarCNPJ(e.target.value) : formatarCPF(e.target.value))}
              placeholder={form.tipo === 'PJ' ? '00.000.000/0000-00' : '000.000.000-00'}
              inputMode="numeric"
              maxLength={form.tipo === 'PJ' ? 18 : 14}
            />
          </Campo>
          <Campo label="Data de aniversário">
            <input type="date" className="hairline" style={inputStyle} value={form.aniversario} onChange={(e) => atualizar('aniversario', e.target.value)} />
          </Campo>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="E-mail">
            <input type="email" className="hairline" style={inputStyle} value={form.email} onChange={(e) => atualizar('email', e.target.value)} placeholder="cliente@email.com" />
          </Campo>
          <Campo label="Telefone">
            <input className="hairline" style={inputStyle} value={form.telefone} onChange={(e) => atualizar('telefone', e.target.value)} placeholder="(11) 90000-0000" />
          </Campo>
        </div>

        <div style={{ marginTop: 4, paddingTop: 16, borderTop: `1px solid ${tokens.border}` }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.graphite600 }}>Endereço</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 16 }}>
          <Campo label="Rua">
            <input className="hairline" style={inputStyle} value={form.rua} onChange={(e) => atualizar('rua', e.target.value)} placeholder="Nome da rua" />
          </Campo>
          <Campo label="Número">
            <input className="hairline" style={inputStyle} value={form.numero} onChange={(e) => atualizar('numero', e.target.value)} placeholder="123" />
          </Campo>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Complemento">
            <input className="hairline" style={inputStyle} value={form.complemento} onChange={(e) => atualizar('complemento', e.target.value)} placeholder="Sala, apto, bloco..." />
          </Campo>
          <Campo label="Bairro">
            <input className="hairline" style={inputStyle} value={form.bairro} onChange={(e) => atualizar('bairro', e.target.value)} placeholder="Bairro" />
          </Campo>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px', gap: 16 }}>
          <Campo label="CEP">
            <input
              className="hairline"
              style={inputStyle}
              value={form.cep}
              onChange={(e) => atualizar('cep', formatarCEP(e.target.value))}
              placeholder="00000-000"
              inputMode="numeric"
              maxLength={9}
            />
          </Campo>
          <Campo label="Estado (UF)">
            <input
              className="hairline"
              style={{ ...inputStyle, textTransform: 'uppercase' }}
              value={form.estado}
              onChange={(e) => atualizar('estado', e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 2))}
              placeholder="SP"
              maxLength={2}
            />
          </Campo>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Cadastrar cliente</Botao>
      </div>
    </ModalBase>
  );
}

function NovoProjetoModal({ clientes, equipe, onFechar, onSalvar }) {
  const [form, setForm] = useState({ nome: '', codigo: '', clienteId: '', equipeResponsavel: '', fotoUrl: '' });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function handleFoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => atualizar('fotoUrl', reader.result);
    reader.readAsDataURL(file);
  }

  function salvar() {
    if (!form.nome.trim() || !form.clienteId) return;
    const cliente = clientes.find((c) => c.id === form.clienteId);
    onSalvar({
      id: `pj-${Date.now()}`,
      nome: form.nome,
      codigo: form.codigo,
      clienteId: form.clienteId,
      cliente: cliente ? cliente.nome : '',
      fase: 'briefing_receptivo',
      prazoEtapa: '',
      statusEtapa: 'em_andamento',
      responsavel: form.equipeResponsavel,
      fotoUrl: form.fotoUrl,
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Novo projeto" onFechar={onFechar} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Nome do projeto">
          <input className="hairline" style={inputStyle} value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} placeholder="Ex.: Residência Alto de Pinheiros" />
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16 }}>
          <Campo label="Código">
            <input className="hairline" style={inputStyle} value={form.codigo} onChange={(e) => atualizar('codigo', e.target.value)} placeholder="Ex.: P08_05_26" />
          </Campo>
          <Campo label="Cliente">
            <select className="hairline" style={inputStyle} value={form.clienteId} onChange={(e) => atualizar('clienteId', e.target.value)}>
              <option value="">Selecionar cliente cadastrado</option>
              {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
            </select>
          </Campo>
        </div>
        <Campo label="Equipe responsável">
          <select className="hairline" style={inputStyle} value={form.equipeResponsavel} onChange={(e) => atualizar('equipeResponsavel', e.target.value)}>
            <option value="">{equipe.length === 0 ? 'Nenhum integrante cadastrado ainda' : 'Selecionar integrante'}</option>
            {equipe.map((m) => (<option key={m.id} value={m.nome}>{m.nome}</option>))}
          </select>
        </Campo>
        <Campo label="Foto do projeto">
          <input type="file" accept="image/*" onChange={handleFoto} style={{ fontSize: 12, color: tokens.graphite700 }} />
          {form.fotoUrl && <img src={form.fotoUrl} alt="Pré-visualização" style={{ marginTop: 10, width: '100%', height: 120, objectFit: 'cover' }} />}
        </Campo>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Cadastrar projeto</Botao>
      </div>
    </ModalBase>
  );
}

function NovaDemandaModal({ projetos, equipe, onFechar, onSalvar }) {
  const [form, setForm] = useState({ titulo: '', projetoId: '', prioridade: 'Média', prazo: '', responsavel: '', observacao: '' });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function salvar() {
    if (!form.titulo.trim()) return;
    onSalvar({
      id: Date.now(),
      titulo: form.titulo,
      projetoId: form.projetoId,
      prioridade: form.prioridade,
      prazo: form.prazo,
      status: 'Aberta',
      responsavel: form.responsavel,
      observacao: form.observacao,
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Nova demanda" onFechar={onFechar} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Título">
          <input className="hairline" style={inputStyle} value={form.titulo} onChange={(e) => atualizar('titulo', e.target.value)} placeholder="Ex.: Aprovar especificação de marcenaria" />
        </Campo>
        <Campo label="Projeto vinculado">
          <select className="hairline" style={inputStyle} value={form.projetoId} onChange={(e) => atualizar('projetoId', e.target.value)}>
            <option value="">Selecionar projeto cadastrado</option>
            {projetos.map((p) => (<option key={p.id} value={p.id}>{p.nome} — {p.cliente}</option>))}
          </select>
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Prioridade">
            <select className="hairline" style={inputStyle} value={form.prioridade} onChange={(e) => atualizar('prioridade', e.target.value)}>
              <option>Baixa</option><option>Média</option><option>Alta</option><option>Urgente</option>
            </select>
          </Campo>
          <Campo label="Prazo">
            <input type="date" className="hairline" style={inputStyle} value={form.prazo} onChange={(e) => atualizar('prazo', e.target.value)} />
          </Campo>
        </div>
        <Campo label="Responsável">
          <select className="hairline" style={inputStyle} value={form.responsavel} onChange={(e) => atualizar('responsavel', e.target.value)}>
            <option value="">{equipe.length === 0 ? 'Nenhum integrante cadastrado ainda' : 'Selecionar integrante'}</option>
            {equipe.map((m) => (<option key={m.id} value={m.nome}>{m.nome}</option>))}
          </select>
        </Campo>
        <Campo label="Observação">
          <textarea
            className="hairline"
            style={{ ...inputStyle, minHeight: 80, resize: 'vertical', fontFamily: "'Manrope', sans-serif" }}
            value={form.observacao}
            onChange={(e) => atualizar('observacao', e.target.value)}
            placeholder="Detalhes, contexto ou instruções para quem for executar"
          />
        </Campo>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Criar demanda</Botao>
      </div>
    </ModalBase>
  );
}

function NovoContratoModal({ clientes, projetos, onFechar, onSalvar }) {
  const [form, setForm] = useState({ clienteId: '', projetoId: '', honorarios: '', parcelas: '6', dataInicio: '2026-08-05' });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const projetosDoCliente = projetos.filter((p) => p.clienteId === form.clienteId);

  function salvar() {
    const valor = Number(form.honorarios);
    const numParcelas = Number(form.parcelas);
    if (!form.clienteId || !valor || !numParcelas) return;
    const cliente = clientes.find((c) => c.id === form.clienteId);
    const projeto = projetos.find((p) => p.id === form.projetoId);
    onSalvar({
      id: `ct-${Date.now()}`,
      clienteId: form.clienteId,
      cliente: cliente ? cliente.nome : '',
      projeto: projeto ? projeto.nome : '—',
      honorarios: valor,
      forma: 'Parcelado',
      status: 'em_vigor',
      parcelas: gerarParcelas(valor, numParcelas, form.dataInicio),
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Novo contrato" onFechar={onFechar} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Cliente">
          <select className="hairline" style={inputStyle} value={form.clienteId} onChange={(e) => atualizar('clienteId', e.target.value)}>
            <option value="">Selecionar cliente cadastrado</option>
            {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
          </select>
        </Campo>
        <Campo label="Projeto vinculado">
          <select className="hairline" style={inputStyle} value={form.projetoId} onChange={(e) => atualizar('projetoId', e.target.value)} disabled={!form.clienteId}>
            <option value="">{form.clienteId ? 'Selecionar projeto (opcional)' : 'Escolha um cliente primeiro'}</option>
            {projetosDoCliente.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
          </select>
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Valor de honorários">
            <input type="number" className="hairline" style={inputStyle} value={form.honorarios} onChange={(e) => atualizar('honorarios', e.target.value)} placeholder="180000" />
          </Campo>
          <Campo label="Número de parcelas">
            <input type="number" min="1" className="hairline" style={inputStyle} value={form.parcelas} onChange={(e) => atualizar('parcelas', e.target.value)} />
          </Campo>
        </div>
        <Campo label="Vencimento da 1ª parcela">
          <input type="date" className="hairline" style={inputStyle} value={form.dataInicio} onChange={(e) => atualizar('dataInicio', e.target.value)} />
        </Campo>
        {Number(form.honorarios) > 0 && Number(form.parcelas) > 0 && (
          <p style={{ margin: 0, fontSize: 12, color: tokens.graphite600 }}>
            {form.parcelas}x de <span className="font-mono">{formatarMoeda(Number(form.honorarios) / Number(form.parcelas))}</span>, a partir de {formatarData(form.dataInicio)}
          </p>
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Criar contrato</Botao>
      </div>
    </ModalBase>
  );
}

function NovaParceriaModal({ clientes, projetos, onFechar, onSalvar }) {
  const [form, setForm] = useState({
    fornecedor: '', numeroOrcamento: '', clienteId: '', projetoId: '',
    tipoPagamento: 'unica',
    parcelas: [{ valor: '', data: '' }],
  });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const projetosDoCliente = projetos.filter((p) => p.clienteId === form.clienteId);

  function trocarTipoPagamento(tipo) {
    setForm((f) => ({ ...f, tipoPagamento: tipo, parcelas: [{ valor: '', data: '' }] }));
  }

  function atualizarParcela(idx, campo, valor) {
    setForm((f) => ({
      ...f,
      parcelas: f.parcelas.map((p, i) => (i === idx ? { ...p, [campo]: valor } : p)),
    }));
  }

  function adicionarParcela() {
    setForm((f) => ({ ...f, parcelas: [...f.parcelas, { valor: '', data: '' }] }));
  }

  function removerParcela(idx) {
    setForm((f) => ({ ...f, parcelas: f.parcelas.filter((_, i) => i !== idx) }));
  }

  function salvar() {
    if (!form.fornecedor.trim() || !form.clienteId) return;
    const parcelasValidas = form.parcelas
      .filter((p) => p.valor && p.data)
      .map((p, i) => ({ numero: i + 1, valor: Number(p.valor), data: p.data }));
    if (parcelasValidas.length === 0) return;
    const cliente = clientes.find((c) => c.id === form.clienteId);
    const projeto = projetos.find((p) => p.id === form.projetoId);
    onSalvar({
      id: `pc-${Date.now()}`,
      fornecedor: form.fornecedor,
      numeroOrcamento: form.numeroOrcamento,
      clienteId: form.clienteId,
      cliente: cliente ? cliente.nome : '',
      projetoId: form.projetoId,
      projeto: projeto ? projeto.nome : '',
      tipoPagamento: form.tipoPagamento,
      parcelas: parcelasValidas,
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Nova parceria" onFechar={onFechar} largura={540} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Fornecedor">
          <input className="hairline" style={inputStyle} value={form.fornecedor} onChange={(e) => atualizar('fornecedor', e.target.value)} placeholder="Nome do fornecedor" />
        </Campo>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Cliente">
            <select className="hairline" style={inputStyle} value={form.clienteId} onChange={(e) => atualizar('clienteId', e.target.value)}>
              <option value="">Selecionar cliente cadastrado</option>
              {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
            </select>
          </Campo>
          <Campo label="Projeto">
            <select className="hairline" style={inputStyle} value={form.projetoId} onChange={(e) => atualizar('projetoId', e.target.value)} disabled={!form.clienteId}>
              <option value="">{form.clienteId ? 'Selecionar projeto (opcional)' : 'Escolha um cliente primeiro'}</option>
              {projetosDoCliente.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
            </select>
          </Campo>
        </div>

        <Campo label="Número / código do orçamento">
          <input className="hairline" style={inputStyle} value={form.numeroOrcamento} onChange={(e) => atualizar('numeroOrcamento', e.target.value)} placeholder="Ex.: ORC-2026-014" />
        </Campo>

        <Campo label="Forma de pagamento">
          <div className="hairline" style={{ display: 'flex' }}>
            <button
              type="button"
              onClick={() => trocarTipoPagamento('unica')}
              style={{
                flex: 1, padding: '9px 12px', fontSize: 13, cursor: 'pointer', border: 'none',
                background: form.tipoPagamento === 'unica' ? tokens.graphite900 : 'transparent',
                color: form.tipoPagamento === 'unica' ? tokens.bg : tokens.graphite700,
              }}
            >
              Parcela única
            </button>
            <button
              type="button"
              onClick={() => trocarTipoPagamento('parcelado')}
              style={{
                flex: 1, padding: '9px 12px', fontSize: 13, cursor: 'pointer', borderTop: 'none', borderBottom: 'none', borderRight: 'none',
                borderLeft: `1px solid ${tokens.border}`,
                background: form.tipoPagamento === 'parcelado' ? tokens.graphite900 : 'transparent',
                color: form.tipoPagamento === 'parcelado' ? tokens.bg : tokens.graphite700,
              }}
            >
              Mais parcelas
            </button>
          </div>
        </Campo>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: tokens.graphite600 }}>
            {form.tipoPagamento === 'unica' ? 'Valor e data de pagamento' : 'Parcelas e datas de pagamento'}
          </span>
          {form.parcelas.map((p, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: form.tipoPagamento === 'parcelado' ? '1fr 1fr 32px' : '1fr 1fr', gap: 10, alignItems: 'center' }}>
              <input
                type="number"
                className="hairline"
                style={inputStyle}
                value={p.valor}
                onChange={(e) => atualizarParcela(idx, 'valor', e.target.value)}
                placeholder={form.tipoPagamento === 'parcelado' ? `Valor da parcela ${idx + 1}` : 'Valor'}
              />
              <input
                type="date"
                className="hairline"
                style={inputStyle}
                value={p.data}
                onChange={(e) => atualizarParcela(idx, 'data', e.target.value)}
              />
              {form.tipoPagamento === 'parcelado' && (
                <button
                  type="button"
                  onClick={() => removerParcela(idx)}
                  disabled={form.parcelas.length === 1}
                  style={{ background: 'transparent', border: 'none', cursor: form.parcelas.length === 1 ? 'default' : 'pointer', color: tokens.graphite600, opacity: form.parcelas.length === 1 ? 0.3 : 1, display: 'flex' }}
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              )}
            </div>
          ))}
          {form.tipoPagamento === 'parcelado' && (
            <button
              type="button"
              onClick={adicionarParcela}
              style={{ alignSelf: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', color: tokens.chromeAccent, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={13} strokeWidth={1.5} /> Adicionar parcela
            </button>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Cadastrar parceria</Botao>
      </div>
    </ModalBase>
  );
}

function NovoMembroModal({ onFechar, onSalvar }) {
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', cargo: CARGOS_EQUIPE[0] });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function salvar() {
    if (!form.nome.trim()) return;
    onSalvar({ id: `eq-${Date.now()}`, nome: form.nome, telefone: form.telefone, email: form.email, cargo: form.cargo });
    onFechar();
  }

  return (
    <ModalBase titulo="Novo integrante" onFechar={onFechar} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Nome">
          <input className="hairline" style={inputStyle} value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} placeholder="Nome completo" />
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Telefone">
            <input className="hairline" style={inputStyle} value={form.telefone} onChange={(e) => atualizar('telefone', e.target.value)} placeholder="(11) 90000-0000" />
          </Campo>
          <Campo label="E-mail">
            <input type="email" className="hairline" style={inputStyle} value={form.email} onChange={(e) => atualizar('email', e.target.value)} placeholder="nome@escritorio.com" />
          </Campo>
        </div>
        <Campo label="Cargo">
          <select className="hairline" style={inputStyle} value={form.cargo} onChange={(e) => atualizar('cargo', e.target.value)}>
            {CARGOS_EQUIPE.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </Campo>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Cadastrar integrante</Botao>
      </div>
    </ModalBase>
  );
}

function NovoOrcamentoModal({ clientes, projetos, onFechar, onSalvar }) {
  const [form, setForm] = useState({ nome: '', clienteId: '', projetoId: '', dataEnvio: dataDeHojeISO(), arquivoNome: '', arquivoUrl: '' });
  const atualizar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  const projetosDoCliente = projetos.filter((p) => p.clienteId === form.clienteId);

  function handleArquivo(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, arquivoNome: file.name, arquivoUrl: reader.result }));
    reader.readAsDataURL(file);
  }

  function salvar() {
    if (!form.nome.trim() || !form.clienteId) return;
    const cliente = clientes.find((c) => c.id === form.clienteId);
    const projeto = projetos.find((p) => p.id === form.projetoId);
    onSalvar({
      id: `orc-${Date.now()}`,
      nome: form.nome,
      clienteId: form.clienteId,
      cliente: cliente ? cliente.nome : '',
      projetoId: form.projetoId,
      projeto: projeto ? projeto.nome : '',
      dataEnvio: form.dataEnvio,
      arquivoNome: form.arquivoNome,
      arquivoUrl: form.arquivoUrl,
    });
    onFechar();
  }

  return (
    <ModalBase titulo="Novo orçamento" onFechar={onFechar} onSubmit={salvar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Campo label="Nome / descrição">
          <input className="hairline" style={inputStyle} value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} placeholder="Ex.: Orçamento marcenaria — Cobertura Jardins" />
        </Campo>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Campo label="Cliente">
            <select className="hairline" style={inputStyle} value={form.clienteId} onChange={(e) => atualizar('clienteId', e.target.value)}>
              <option value="">Selecionar cliente cadastrado</option>
              {clientes.map((c) => (<option key={c.id} value={c.id}>{c.nome}</option>))}
            </select>
          </Campo>
          <Campo label="Projeto">
            <select className="hairline" style={inputStyle} value={form.projetoId} onChange={(e) => atualizar('projetoId', e.target.value)} disabled={!form.clienteId}>
              <option value="">{form.clienteId ? 'Selecionar projeto (opcional)' : 'Escolha um cliente primeiro'}</option>
              {projetosDoCliente.map((p) => (<option key={p.id} value={p.id}>{p.nome}</option>))}
            </select>
          </Campo>
        </div>
        <Campo label="Data de envio">
          <input type="date" className="hairline" style={inputStyle} value={form.dataEnvio} onChange={(e) => atualizar('dataEnvio', e.target.value)} />
        </Campo>
        <Campo label="Arquivo">
          <input type="file" onChange={handleArquivo} style={{ fontSize: 12, color: tokens.graphite700 }} />
          {form.arquivoNome && <p style={{ margin: '8px 0 0', fontSize: 12, color: tokens.graphite600 }}>{form.arquivoNome}</p>}
        </Campo>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 28 }}>
        <Botao variante="secondary" onClick={onFechar}>Cancelar</Botao>
        <Botao type="submit">Anexar orçamento</Botao>
      </div>
    </ModalBase>
  );
}

function DetalheDemandaModal({ demanda, projeto, onFechar, onConcluir, onExcluir }) {
  if (!demanda) return null;
  return (
    <ModalBase titulo="Demanda" onFechar={onFechar} largura={480}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <p style={{ margin: 0, fontSize: 16, color: tokens.graphite900 }}>{demanda.titulo}</p>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: tokens.graphite600 }}>
            {projeto ? `${projeto.nome} · ${projeto.cliente}` : 'Sem projeto vinculado'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge tone={demanda.prioridade === 'Urgente' ? 'alert' : 'neutral'}>{demanda.prioridade}</Badge>
          <Badge tone="ghost">{demanda.status}</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, paddingTop: 4 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Prazo</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: tokens.graphite900 }}>{formatarData(demanda.prazo)}</p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Responsável</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: tokens.graphite900 }}>{demanda.responsavel || '—'}</p>
          </div>
        </div>

        {demanda.observacao && (
          <div>
            <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Observação</p>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: tokens.graphite700, lineHeight: 1.5 }}>{demanda.observacao}</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 28 }}>
        <button
          onClick={() => onExcluir(demanda.id)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 12, color: tokens.alert }}
        >
          Excluir demanda
        </button>
        <div style={{ display: 'flex', gap: 12 }}>
          <Botao variante="secondary" onClick={onFechar}>Fechar</Botao>
          {demanda.status !== 'Concluída' && (
            <Botao onClick={() => onConcluir(demanda.id)}><Check size={14} strokeWidth={1.5} />Marcar como concluída</Botao>
          )}
        </div>
      </div>
    </ModalBase>
  );
}

// ---------------------------------------------------------------------
// Vista: Painel geral
// ---------------------------------------------------------------------

function PainelGeralView({ demandas, projetos, clientes, notificacoes, onMarcarNotificacoesLidas, onNovaDemanda, onAbrirDemanda }) {
  const [notificacoesAbertas, setNotificacoesAbertas] = useState(false);
  const [demandasExpandidas, setDemandasExpandidas] = useState(false);

  const ativas = demandas.filter((d) => d.status !== 'Concluída');
  const porPrioridade = {
    Urgente: ativas.filter((d) => d.prioridade === 'Urgente'),
    Alta: ativas.filter((d) => d.prioridade === 'Alta'),
    Média: ativas.filter((d) => d.prioridade === 'Média'),
    Baixa: ativas.filter((d) => d.prioridade === 'Baixa'),
  };

  const aniversariantes = listarAniversariosProximos(clientes);
  const estados = calcularEstadosAtuacao(clientes);
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  function handleClickSino() {
    setNotificacoesAbertas((v) => !v);
    if (naoLidas > 0) onMarcarNotificacoesLidas();
  }

  const resumoCards = [
    { label: 'Clientes cadastrados', valor: String(clientes.length).padStart(2, '0'), Icon: Users },
    { label: 'Projetos cadastrados', valor: String(projetos.length).padStart(2, '0'), Icon: Building2 },
    { label: 'Demandas ativas', valor: String(ativas.length).padStart(2, '0'), Icon: ClipboardList },
    { label: 'Urgentes', valor: String(porPrioridade.Urgente.length).padStart(2, '0'), Icon: AlertTriangle, tone: 'alert' },
  ];

  return (
    <div>
      <TopBar
        eyebrow="Painel geral"
        titulo="Visão geral do escritório"
        acao={
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
            </span>

            <div style={{ position: 'relative' }}>
              <button onClick={handleClickSino} style={{ background: 'transparent', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', color: tokens.graphite700 }}>
                <Bell size={18} strokeWidth={1.5} />
                {naoLidas > 0 && (
                  <span className="font-mono" style={{ position: 'absolute', top: -5, right: -6, minWidth: 14, height: 14, padding: '0 3px', borderRadius: 7, background: tokens.alert, color: tokens.bg, fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {naoLidas}
                  </span>
                )}
              </button>
              {notificacoesAbertas && (
                <div className="hairline" style={{ position: 'absolute', top: '140%', right: 0, width: 300, background: tokens.surface, zIndex: 10, maxHeight: 320, overflowY: 'auto' }}>
                  {notificacoes.length === 0 ? (
                    <p style={{ margin: 0, padding: 20, fontSize: 12, color: tokens.graphite600, textAlign: 'center' }}>Nenhuma notificação ainda.</p>
                  ) : (
                    notificacoes.slice().reverse().map((n, i) => (
                      <div key={n.id} style={{ padding: '12px 16px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                        <p style={{ margin: 0, fontSize: 12, color: tokens.graphite900 }}>{n.mensagem}</p>
                        <p className="font-mono" style={{ margin: '4px 0 0', fontSize: 11, color: tokens.graphite600 }}>{formatarData(n.data)}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <Botao onClick={onNovaDemanda}><Plus size={14} strokeWidth={1.5} />Nova demanda</Botao>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 20, marginBottom: 20 }}>
        {resumoCards.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {estados.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: tokens.graphite600 }}>Atuando em:</span>
          {estados.map((uf) => <Badge key={uf} tone="chrome">{uf}</Badge>)}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <div
            onClick={() => setDemandasExpandidas((v) => !v)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', marginBottom: 16 }}
          >
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Demandas por prioridade</h2>
            <span style={{ fontSize: 12, color: tokens.chromeAccent }}>{demandasExpandidas ? 'Recolher' : 'Ver todas'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: demandasExpandidas ? 20 : 0 }}>
            {['Urgente', 'Alta', 'Média', 'Baixa'].map((p) => (
              <div key={p} className="hairline" onClick={() => setDemandasExpandidas(true)} style={{ background: tokens.surface, padding: '14px 12px', cursor: 'pointer', textAlign: 'center' }}>
                <span className="font-mono" style={{ fontSize: 20, color: p === 'Urgente' ? tokens.alert : tokens.graphite900 }}>{String(porPrioridade[p].length).padStart(2, '0')}</span>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: tokens.graphite600 }}>{p}</p>
              </div>
            ))}
          </div>

          {demandasExpandidas && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {['Urgente', 'Alta', 'Média', 'Baixa'].map((p) => (
                porPrioridade[p].length > 0 && (
                  <div key={p}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.graphite600 }}>{p}</p>
                    <div className="hairline" style={{ background: tokens.surface }}>
                      {porPrioridade[p].map((d, i) => {
                        const projeto = projetos.find((pr) => pr.id === d.projetoId);
                        return (
                          <div key={d.id} onClick={() => onAbrirDemanda(d.id)} style={{ padding: '12px 16px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none', cursor: 'pointer' }}>
                            <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{d.titulo}</p>
                            <p style={{ margin: '3px 0 0', fontSize: 11, color: tokens.graphite600 }}>{projeto ? projeto.nome : 'Sem vínculo'} · {formatarData(d.prazo)}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {!demandasExpandidas && ativas.length === 0 && (
            <EmptyState titulo="Nenhuma demanda cadastrada ainda." acaoLabel="Criar a primeira demanda" onAcao={onNovaDemanda} />
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Aniversários da semana</h2>
          {aniversariantes.length === 0 ? (
            <p className="hairline" style={{ background: tokens.surface, padding: '24px 16px', textAlign: 'center', fontSize: 12, color: tokens.graphite600 }}>Nenhum aniversário nos próximos 7 dias.</p>
          ) : (
            <div className="hairline" style={{ background: tokens.surface }}>
              {aniversariantes.map((a, i) => (
                <div key={a.nome + a.aniversario} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                  <span style={{ fontSize: 13, color: tokens.graphite900 }}>{a.nome}</span>
                  <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{a.diasRestantes === 0 ? 'Hoje' : `em ${a.diasRestantes}d`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Clientes
// ---------------------------------------------------------------------

function ClientesView({ clientes, contratos, parcerias, onNovoCliente, onExcluirCliente }) {
  const emProspeccao = clientes.filter((c) => ['lead', 'em_qualificacao', 'proposta_enviada', 'negociacao'].includes(c.status)).length;
  const ativos = clientes.filter((c) => c.status === 'cliente_ativo').length;
  const aniversariosProximos = contarAniversariosProximos(clientes);
  const [confirmandoId, setConfirmandoId] = useState(null);

  const COLS_CLIENTES = '1.3fr 70px 100px 1fr 120px 130px 110px';

  return (
    <div>
      <TopBar eyebrow="Clientes" titulo="Clientes cadastrados" acao={<Botao onClick={onNovoCliente}><UserPlus size={14} strokeWidth={1.5} />Novo cliente</Botao>} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard label="Clientes cadastrados" valor={String(clientes.length).padStart(2, '0')} />
        <StatCard label="Em prospecção" valor={String(emProspeccao).padStart(2, '0')} />
        <StatCard label="Clientes ativos" valor={String(ativos).padStart(2, '0')} />
        <StatCard label="Aniversários (7 dias)" valor={String(aniversariosProximos).padStart(2, '0')} Icon={Clock3} />
      </div>

      {clientes.length === 0 ? (
        <EmptyState titulo="Nenhum cliente cadastrado ainda." acaoLabel="Cadastrar o primeiro cliente" onAcao={onNovoCliente} />
      ) : (
      <div className="hairline" style={{ background: tokens.surface }}>
        <div style={{ display: 'grid', gridTemplateColumns: COLS_CLIENTES, gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
          <span>Cliente</span><span>Tipo</span><span>Nível</span><span>Status</span><span>Responsável</span><span>Ganho total</span><span />
        </div>
        {clientes.map((c, i) => {
          const ganho = calcularGanhoPorCliente(c.id, contratos, parcerias);
          return (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: COLS_CLIENTES, gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
            <span style={{ fontSize: 13, color: tokens.graphite900 }}>{c.nome}</span>
            <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{c.tipo}</span>
            <span><Badge tone={c.nivel === 'VIP' ? 'chrome' : 'neutral'}>{c.nivel}</Badge></span>
            <span style={{ fontSize: 12, color: c.status === 'cliente_ativo' ? tokens.graphite800 : tokens.graphite600 }}>{STATUS_PROSPECCAO_LABEL[c.status]}</span>
            <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600 }}>{c.responsavel}</span>
            <span className="font-mono" style={{ fontSize: 12, color: ganho > 0 ? tokens.graphite900 : tokens.graphite600 }}>{ganho > 0 ? formatarMoeda(ganho) : '—'}</span>

            {confirmandoId === c.id ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button onClick={() => setConfirmandoId(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: tokens.graphite600 }}>Cancelar</button>
                <button onClick={() => { onExcluirCliente(c.id); setConfirmandoId(null); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 11, color: tokens.alert, fontWeight: 500 }}>Excluir</button>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmandoId(c.id)} title="Excluir cliente" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: tokens.graphite600, padding: 4, display: 'flex' }}>
                  <Trash2 size={14} strokeWidth={1.5} />
                </button>
              </div>
            )}
          </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Projetos
// ---------------------------------------------------------------------

function ProjetoCardMini({ projeto, onDragStart, onDragEnd, onAbrir }) {
  const urgencia = calcularUrgenciaPrazo(projeto.prazoEtapa);
  const aguardando = projeto.statusEtapa === 'aguardando_aprovacao_cliente';
  const temAlerta = urgencia.nivel === 'atrasado' || urgencia.nivel === 'proximo' || aguardando;

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} onClick={onAbrir} className="hairline" style={{ background: tokens.surface, padding: 0, cursor: 'grab', borderLeft: urgencia.nivel === 'atrasado' ? `2px solid ${tokens.alert}` : `1px solid ${tokens.border}`, overflow: 'hidden' }}>
      {projeto.fotoUrl && <img src={projeto.fotoUrl} alt={projeto.nome} style={{ width: '100%', height: 110, objectFit: 'cover', display: 'block' }} />}
      <div style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.4, color: tokens.graphite900 }}>{projeto.nome}</p>
          <GripVertical size={13} strokeWidth={1.5} color={tokens.graphite600} style={{ opacity: 0.4, flexShrink: 0 }} />
        </div>
        {projeto.codigo && <p style={{ margin: '2px 0 0' }} className="font-mono"><span style={{ fontSize: 10, color: tokens.graphite600 }}>{projeto.codigo}</span></p>}
        <p style={{ margin: '4px 0 0', fontSize: 12, color: tokens.graphite600 }}>{projeto.cliente}</p>

        {temAlerta && (
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${tokens.border}`, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {urgencia.nivel === 'atrasado' && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: tokens.alert }}><AlertTriangle size={11} strokeWidth={1.5} /> Prazo vencido há {Math.abs(urgencia.dias)}d</span>}
            {urgencia.nivel === 'proximo' && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: tokens.graphite800 }}><AlertTriangle size={11} strokeWidth={1.5} /> Prazo em {urgencia.dias}d</span>}
            {aguardando && <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: tokens.chromeAccent }}><Clock3 size={11} strokeWidth={1.5} /> Aguardando aprovação</span>}
          </div>
        )}

        <div style={{ marginTop: 10, textAlign: 'right' }}>
          <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600 }}>{projeto.responsavel || 'Sem responsável'}</span>
        </div>
      </div>
    </div>
  );
}

function ProjetosView({ projetos, setProjetos, onNovoProjeto, onAbrirProjeto }) {
  const [arrastando, setArrastando] = useState(null);
  const [colunaFoco, setColunaFoco] = useState(null);

  function handleDrop(faseKey) {
    if (arrastando) {
      setProjetos((atual) => atual.map((p) => (p.id === arrastando ? { ...p, fase: faseKey, statusEtapa: 'em_andamento' } : p)));
    }
    setArrastando(null);
    setColunaFoco(null);
  }

  return (
    <div>
      <TopBar eyebrow="Operacional" titulo="Gestão de projetos" acao={<Botao onClick={onNovoProjeto}><Plus size={14} strokeWidth={1.5} />Novo projeto</Botao>} />

      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
        {PHASES.map((fase) => {
          const projetosDaFase = projetos.filter((p) => p.fase === fase.key);
          const emFoco = colunaFoco === fase.key;
          return (
            <div key={fase.key} onDragOver={(e) => { e.preventDefault(); setColunaFoco(fase.key); }} onDragLeave={() => setColunaFoco((a) => (a === fase.key ? null : a))} onDrop={() => handleDrop(fase.key)} style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', background: tokens.bg, border: `1px solid ${emFoco ? tokens.chromeAccent : tokens.border}` }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '12px 14px', borderBottom: `1px solid ${tokens.border}` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span className="font-mono" style={{ fontSize: 10, color: tokens.graphite600 }}>{String(fase.ordem).padStart(2, '0')}</span>
                  <h3 style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.graphite800 }}>{fase.label}</h3>
                </div>
                <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600 }}>{projetosDaFase.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10, minHeight: 80 }}>
                {projetosDaFase.length === 0 && <p style={{ margin: 0, padding: '24px 4px', textAlign: 'center', fontSize: 12, color: tokens.graphite600, opacity: 0.5 }}>Nenhum projeto</p>}
                {projetosDaFase.map((p) => (<ProjetoCardMini key={p.id} projeto={p} onDragStart={() => setArrastando(p.id)} onDragEnd={() => setArrastando(null)} onAbrir={() => onAbrirProjeto(p.id)} />))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Demandas
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Vista: detalhe de um projeto (visão geral, demandas, revisões,
// arquivos, acervo fotográfico e exportação de panorama em PDF)
// ---------------------------------------------------------------------

function gerarPdfPanoramaProjeto(projeto, contratoDoProjeto, demandasDoProjeto, revisoes) {
  import('jspdf').then(({ default: jsPDF }) => {
    const doc = new jsPDF();
    let y = 20;
    const quebrarPaginaSeNecessario = () => {
      if (y > 275) { doc.addPage(); y = 20; }
    };

    doc.setFontSize(16);
    doc.text(projeto.nome, 14, y);
    y += 9;

    doc.setFontSize(10);
    doc.text(`Código: ${projeto.codigo || '—'}`, 14, y); y += 6;
    doc.text(`Cliente: ${projeto.cliente || '—'}`, 14, y); y += 6;
    doc.text(`Equipe responsável: ${projeto.responsavel || '—'}`, 14, y); y += 6;
    const fase = PHASES.find((f) => f.key === projeto.fase);
    doc.text(`Fase atual: ${fase ? fase.label : '—'}`, 14, y); y += 6;
    doc.text(`Prazo da etapa: ${formatarData(projeto.prazoEtapa)}`, 14, y); y += 6;
    doc.text(`Gerado em: ${formatarData(dataDeHojeISO())}`, 14, y); y += 12;

    doc.setFontSize(12);
    doc.text('Contrato', 14, y); y += 7;
    doc.setFontSize(10);
    if (contratoDoProjeto) {
      doc.text(`Honorários: ${formatarMoeda(contratoDoProjeto.honorarios)}`, 14, y); y += 6;
      doc.text(`Status: ${contratoDoProjeto.status === 'em_vigor' ? 'Em vigor' : 'Encerrado'}`, 14, y); y += 6;
    } else {
      doc.text('Nenhum contrato vinculado.', 14, y); y += 6;
    }
    y += 6;

    doc.setFontSize(12);
    doc.text(`Demandas ativas (${demandasDoProjeto.length})`, 14, y); y += 7;
    doc.setFontSize(10);
    if (demandasDoProjeto.length === 0) {
      doc.text('Nenhuma demanda ativa.', 14, y); y += 6;
    } else {
      demandasDoProjeto.forEach((d) => {
        quebrarPaginaSeNecessario();
        doc.text(`• [${d.prioridade}] ${d.titulo}`, 14, y);
        y += 6;
      });
    }
    y += 6;
    quebrarPaginaSeNecessario();

    doc.setFontSize(12);
    doc.text(`Revisões (${revisoes.length})`, 14, y); y += 7;
    doc.setFontSize(10);
    if (revisoes.length === 0) {
      doc.text('Nenhuma revisão registrada.', 14, y);
    } else {
      revisoes.forEach((r) => {
        quebrarPaginaSeNecessario();
        doc.text(`• ${formatarData(r.data)} — ${r.titulo}`, 14, y);
        y += 6;
      });
    }

    const nomeArquivo = `panorama-${(projeto.codigo || projeto.nome).replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(nomeArquivo);
  });
}

function ProjetoDetalheView({ projeto, contratos, demandas, equipe, onVoltar, onAtualizarProjeto, onAbrirDemanda }) {
  const [aba, setAba] = useState('geral');
  const [novaRevisao, setNovaRevisao] = useState(false);
  const [formRevisao, setFormRevisao] = useState({ titulo: '', descricao: '', autor: '' });
  const [legendaFotoTemp, setLegendaFotoTemp] = useState('');

  const contratoDoProjeto = contratos.find((c) => c.projetoId === projeto.id);
  const demandasDoProjeto = demandas.filter((d) => d.projetoId === projeto.id);
  const revisoes = projeto.revisoes || [];
  const arquivos = projeto.arquivos || [];
  const fotos = projeto.fotos || [];

  const ABAS = [
    { key: 'geral', label: 'Visão geral' },
    { key: 'demandas', label: `Demandas (${demandasDoProjeto.length})` },
    { key: 'revisoes', label: `Revisões (${revisoes.length})` },
    { key: 'arquivos', label: `Arquivos (${arquivos.length})` },
    { key: 'fotos', label: `Acervo fotográfico (${fotos.length})` },
  ];

  function mudarFase(novaFaseKey) {
    onAtualizarProjeto(projeto.id, { fase: novaFaseKey, statusEtapa: 'em_andamento' });
  }

  function adicionarRevisao() {
    if (!formRevisao.titulo.trim()) return;
    const nova = { id: `rev-${Date.now()}`, titulo: formRevisao.titulo, descricao: formRevisao.descricao, autor: formRevisao.autor, data: dataDeHojeISO() };
    onAtualizarProjeto(projeto.id, { revisoes: [...revisoes, nova] });
    setFormRevisao({ titulo: '', descricao: '', autor: '' });
    setNovaRevisao(false);
  }

  function handleArquivo(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const novo = { id: `arq-${Date.now()}`, nome: file.name, url: reader.result, data: dataDeHojeISO() };
      onAtualizarProjeto(projeto.id, { arquivos: [...arquivos, novo] });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleFoto(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const nova = { id: `foto-${Date.now()}`, url: reader.result, legenda: legendaFotoTemp };
      onAtualizarProjeto(projeto.id, { fotos: [...fotos, nova] });
      setLegendaFotoTemp('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div>
      <button onClick={onVoltar} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: tokens.graphite600, fontSize: 12, marginBottom: 24 }}>
        <ArrowLeft size={14} strokeWidth={1.5} /> Voltar para projetos
      </button>

      <TopBar
        eyebrow="Projeto"
        titulo={projeto.nome}
        acao={<Botao variante="secondary" onClick={() => gerarPdfPanoramaProjeto(projeto, contratoDoProjeto, demandasDoProjeto, revisoes)}><FileText size={14} strokeWidth={1.5} />Gerar PDF do panorama</Botao>}
      />

      <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${tokens.border}`, marginBottom: 28, flexWrap: 'wrap' }}>
        {ABAS.map((a) => (
          <button
            key={a.key}
            onClick={() => setAba(a.key)}
            style={{
              padding: '10px 14px', fontSize: 12.5, background: 'transparent', border: 'none', cursor: 'pointer',
              color: aba === a.key ? tokens.graphite900 : tokens.graphite600,
              borderBottom: aba === a.key ? `2px solid ${tokens.chromeAccent}` : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'geral' && (
        <div>
          {projeto.fotoUrl && <img src={projeto.fotoUrl} alt={projeto.nome} style={{ width: '100%', maxHeight: 260, objectFit: 'cover', marginBottom: 28 }} />}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Código</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: tokens.graphite900 }}>{projeto.codigo || '—'}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Cliente</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: tokens.graphite900 }}>{projeto.cliente}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Equipe responsável</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: tokens.graphite900 }}>{projeto.responsavel || 'Sem responsável'}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Prazo da etapa atual</p>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: tokens.graphite900 }}>{formatarData(projeto.prazoEtapa)}</p>
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Fase do projeto</p>
            <select className="hairline" style={{ ...inputStyle, maxWidth: 320 }} value={projeto.fase} onChange={(e) => mudarFase(e.target.value)}>
              {PHASES.map((f) => (<option key={f.key} value={f.key}>{f.label}</option>))}
            </select>
          </div>

          <div>
            <p style={{ margin: '0 0 8px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>Contrato vinculado</p>
            {contratoDoProjeto ? (
              <div className="hairline" style={{ background: tokens.surface, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{formatarMoeda(contratoDoProjeto.honorarios)}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: tokens.graphite600 }}>{contratoDoProjeto.forma}</p>
                </div>
                <Badge tone={contratoDoProjeto.status === 'em_vigor' ? 'neutral' : 'ghost'}>{contratoDoProjeto.status === 'em_vigor' ? 'Em vigor' : 'Encerrado'}</Badge>
              </div>
            ) : (
              <p className="hairline" style={{ background: tokens.surface, padding: '16px 20px', fontSize: 12, color: tokens.graphite600 }}>Nenhum contrato vinculado ainda — cadastre em Financeiro.</p>
            )}
          </div>
        </div>
      )}

      {aba === 'demandas' && (
        demandasDoProjeto.length === 0 ? (
          <EmptyState titulo="Nenhuma demanda vinculada a este projeto ainda." />
        ) : (
          <div className="hairline" style={{ background: tokens.surface }}>
            {demandasDoProjeto.map((d, i) => (
              <div key={d.id} onClick={() => onAbrirDemanda(d.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none', cursor: 'pointer' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{d.titulo}</p>
                  <p style={{ margin: '3px 0 0', fontSize: 12, color: tokens.graphite600 }}>{d.status}</p>
                </div>
                <Badge tone={d.prioridade === 'Urgente' ? 'alert' : 'neutral'}>{d.prioridade}</Badge>
              </div>
            ))}
          </div>
        )
      )}

      {aba === 'revisoes' && (
        <div>
          {!novaRevisao ? (
            <Botao variante="secondary" onClick={() => setNovaRevisao(true)}><Plus size={13} strokeWidth={1.5} />Nova revisão</Botao>
          ) : (
            <div className="hairline" style={{ background: tokens.surface, padding: 20, marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input className="hairline" style={inputStyle} placeholder="Título da revisão" value={formRevisao.titulo} onChange={(e) => setFormRevisao((f) => ({ ...f, titulo: e.target.value }))} />
              <textarea className="hairline" style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }} placeholder="Descrição" value={formRevisao.descricao} onChange={(e) => setFormRevisao((f) => ({ ...f, descricao: e.target.value }))} />
              <select className="hairline" style={inputStyle} value={formRevisao.autor} onChange={(e) => setFormRevisao((f) => ({ ...f, autor: e.target.value }))}>
                <option value="">Autor da revisão</option>
                {equipe.map((m) => (<option key={m.id} value={m.nome}>{m.nome}</option>))}
              </select>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <Botao variante="secondary" onClick={() => setNovaRevisao(false)}>Cancelar</Botao>
                <Botao onClick={adicionarRevisao}>Salvar revisão</Botao>
              </div>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            {revisoes.length === 0 ? (
              <EmptyState titulo="Nenhuma revisão registrada ainda." />
            ) : (
              <div className="hairline" style={{ background: tokens.surface }}>
                {revisoes.slice().reverse().map((r, i) => (
                  <div key={r.id} style={{ padding: '14px 20px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{r.titulo}</p>
                      <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600, flexShrink: 0 }}>{formatarData(r.data)}</span>
                    </div>
                    {r.descricao && <p style={{ margin: '6px 0 0', fontSize: 12, color: tokens.graphite700, lineHeight: 1.5 }}>{r.descricao}</p>}
                    {r.autor && <p style={{ margin: '6px 0 0', fontSize: 11, color: tokens.graphite600 }}>{r.autor}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'arquivos' && (
        <div>
          <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 13, cursor: 'pointer', marginBottom: 20 }}>
            <Paperclip size={14} strokeWidth={1.5} /> Anexar arquivo
            <input type="file" onChange={handleArquivo} style={{ display: 'none' }} />
          </label>
          {arquivos.length === 0 ? (
            <EmptyState titulo="Nenhum arquivo anexado ainda." />
          ) : (
            <div className="hairline" style={{ background: tokens.surface }}>
              {arquivos.map((a, i) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                  <span style={{ fontSize: 13, color: tokens.graphite900 }}>{a.nome}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600 }}>{formatarData(a.data)}</span>
                    <a href={a.url} download={a.nome} style={{ fontSize: 12, color: tokens.chromeAccent }}>Baixar</a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {aba === 'fotos' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            <input className="hairline" style={{ ...inputStyle, maxWidth: 260 }} placeholder="Legenda (opcional)" value={legendaFotoTemp} onChange={(e) => setLegendaFotoTemp(e.target.value)} />
            <label className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', fontSize: 13, cursor: 'pointer' }}>
              <Plus size={14} strokeWidth={1.5} /> Adicionar foto
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: 'none' }} />
            </label>
          </div>
          {fotos.length === 0 ? (
            <EmptyState titulo="Nenhuma foto no acervo ainda." />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {fotos.map((f) => (
                <div key={f.id} className="hairline" style={{ background: tokens.surface, overflow: 'hidden' }}>
                  <img src={f.url} alt={f.legenda || projeto.nome} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                  {f.legenda && <p style={{ margin: 0, padding: '8px 10px', fontSize: 11, color: tokens.graphite600 }}>{f.legenda}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProjetosModulo({ projetos, setProjetos, contratos, demandas, equipe, onNovoProjeto, onAtualizarProjeto, onAbrirDemanda }) {
  const [projetoSelecionadoId, setProjetoSelecionadoId] = useState(null);
  const projeto = projetos.find((p) => p.id === projetoSelecionadoId);

  if (projeto) {
    return (
      <ProjetoDetalheView
        projeto={projeto}
        contratos={contratos}
        demandas={demandas}
        equipe={equipe}
        onVoltar={() => setProjetoSelecionadoId(null)}
        onAtualizarProjeto={onAtualizarProjeto}
        onAbrirDemanda={onAbrirDemanda}
      />
    );
  }

  return <ProjetosView projetos={projetos} setProjetos={setProjetos} onNovoProjeto={onNovoProjeto} onAbrirProjeto={setProjetoSelecionadoId} />;
}

function DemandasView({ demandas, projetos, onNovaDemanda, onAbrirDemanda }) {
  return (
    <div>
      <TopBar eyebrow="Operacional" titulo="Demandas" acao={<Botao onClick={onNovaDemanda}><Plus size={14} strokeWidth={1.5} />Nova demanda</Botao>} />
      {demandas.length === 0 ? (
        <EmptyState titulo="Nenhuma demanda cadastrada ainda." acaoLabel="Criar a primeira demanda" onAcao={onNovaDemanda} />
      ) : (
      <div className="hairline" style={{ background: tokens.surface }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 100px 100px 120px', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
          <span>Demanda</span><span>Projeto / Cliente</span><span>Prioridade</span><span>Prazo</span><span>Responsável</span>
        </div>
        {demandas.map((d, i) => {
          const projeto = projetos.find((p) => p.id === d.projetoId);
          const urgencia = calcularUrgenciaPrazo(d.prazo);
          return (
            <div key={d.id} onClick={() => onAbrirDemanda(d.id)} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 100px 100px 120px', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none', cursor: 'pointer' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{d.titulo}</p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: tokens.graphite600 }}>{d.status}</p>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: tokens.graphite800 }}>{projeto ? projeto.nome : 'Sem vínculo'}</p>
                {projeto && <p style={{ margin: '2px 0 0', fontSize: 11, color: tokens.graphite600 }}>{projeto.cliente}</p>}
              </div>
              <Badge tone={d.prioridade === 'Urgente' ? 'alert' : 'neutral'}>{d.prioridade}</Badge>
              <span className="font-mono" style={{ fontSize: 12, color: urgencia.nivel === 'atrasado' ? tokens.alert : tokens.graphite700 }}>{formatarData(d.prazo)}</span>
              <span className="font-mono" style={{ fontSize: 11, color: tokens.graphite600 }}>{d.responsavel || '—'}</span>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Financeiro
// ---------------------------------------------------------------------

function FinanceiroView({ contratos, clientes, projetos, onNovoContrato }) {
  const [minutas, setMinutas] = useState(minutasMockInicial);
  const fluxoPorCliente = calcularFluxoPorCliente(contratos);
  const panorama = calcularPanoramaMensal(contratos);
  const maxPanorama = Math.max(...panorama.map((p) => p.total), 1);

  const totalPendente = fluxoPorCliente.reduce((s, c) => s + c.pendente, 0);
  const totalRecebido = fluxoPorCliente.reduce((s, c) => s + c.recebido, 0);
  const contratosAtivos = contratos.filter((c) => c.status === 'em_vigor').length;

  function decidirMinuta(id) {
    setMinutas((atual) => atual.filter((m) => m.id !== id));
  }

  return (
    <div>
      <TopBar
        eyebrow="Administrativo"
        titulo="Gestão administrativa"
        acao={
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${tokens.border}`, padding: '4px 10px', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.graphite600 }}>
              <ShieldCheck size={12} strokeWidth={1.5} /> Acesso restrito
            </span>
            <Botao onClick={onNovoContrato}><Plus size={14} strokeWidth={1.5} />Novo contrato</Botao>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
        <StatCard label="A receber" valor={formatarMoeda(totalPendente)} />
        <StatCard label="Recebido (acumulado)" valor={formatarMoeda(totalRecebido)} />
        <StatCard label="Contratos em vigor" valor={String(contratosAtivos).padStart(2, '0')} />
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Panorama de recebimento mês a mês</h2>
        {panorama.length === 0 ? (
          <EmptyState titulo="Nenhum contrato cadastrado ainda — o panorama aparece assim que houver parcelas lançadas." acaoLabel="Criar o primeiro contrato" onAcao={onNovoContrato} />
        ) : (
        <div className="hairline" style={{ background: tokens.surface, padding: '18px 24px' }}>
          {panorama.map((m) => (
            <div key={m.chave} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '7px 0' }}>
              <span className="font-mono" style={{ width: 56, fontSize: 12, color: tokens.graphite600, textTransform: 'capitalize' }}>{m.label}</span>
              <div style={{ flex: 1, height: 6, background: tokens.surfaceAlt }}>
                <div style={{ width: `${(m.total / maxPanorama) * 100}%`, height: '100%', background: tokens.chromeAccent }} />
              </div>
              <span className="font-mono" style={{ width: 110, textAlign: 'right', fontSize: 12, color: tokens.graphite900 }}>{formatarMoeda(m.total)}</span>
            </div>
          ))}
        </div>
        )}
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Fluxo de pagamentos por cliente</h2>
        {fluxoPorCliente.length === 0 ? (
          <EmptyState titulo="Nenhum contrato cadastrado ainda." acaoLabel="Criar o primeiro contrato" onAcao={onNovoContrato} />
        ) : (
        <div className="hairline" style={{ background: tokens.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 120px', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
            <span>Cliente</span><span>Contratado</span><span>Recebido</span><span>Pendente</span><span>Próx. vencimento</span>
          </div>
          {fluxoPorCliente.map((c, i) => {
            const urgencia = calcularUrgenciaPrazo(c.proximoVencimento);
            return (
              <div key={c.cliente} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr 120px', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: tokens.graphite900 }}>{c.cliente}</span>
                <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite700 }}>{formatarMoeda(c.contratado)}</span>
                <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite700 }}>{formatarMoeda(c.recebido)}</span>
                <span className="font-mono" style={{ fontSize: 12, color: c.pendente > 0 ? tokens.graphite900 : tokens.graphite600 }}>{c.pendente > 0 ? formatarMoeda(c.pendente) : '—'}</span>
                <span className="font-mono" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: urgencia.nivel === 'atrasado' ? tokens.alert : tokens.graphite600 }}>
                  {urgencia.nivel === 'atrasado' && <AlertTriangle size={11} strokeWidth={1.5} />}
                  {formatarData(c.proximoVencimento)}
                </span>
              </div>
            );
          })}
        </div>
        )}
      </div>

      <div style={{ marginBottom: 40 }}>
        <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Minutas aguardando decisão ({minutas.length})</h2>
        {minutas.length === 0 ? (
          <p className="hairline" style={{ background: tokens.surface, padding: '32px 24px', textAlign: 'center', fontSize: 13, color: tokens.graphite600 }}>Nenhuma minuta pendente.</p>
        ) : (
          <div className="hairline" style={{ background: tokens.surface }}>
            {minutas.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                <div style={{ minWidth: 220 }}>
                  <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{m.tipo} — {m.cliente}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 12, color: tokens.graphite600 }}>{m.projeto} · {m.responsavel} · {formatarData(m.data)}</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Botao variante="secondary" onClick={() => decidirMinuta(m.id)}><X size={13} strokeWidth={1.5} />Recusar</Botao>
                  <Botao onClick={() => decidirMinuta(m.id)}><Check size={13} strokeWidth={1.5} />Aprovar</Botao>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Contratos e honorários</h2>
        {contratos.length === 0 ? (
          <EmptyState titulo="Nenhum contrato cadastrado ainda." acaoLabel="Criar o primeiro contrato" onAcao={onNovoContrato} />
        ) : (
        <div className="hairline" style={{ background: tokens.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 110px', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
            <span>Cliente / Projeto</span><span>Honorários</span><span>Forma</span><span>Status</span>
          </div>
          {contratos.map((c, i) => (
            <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 110px', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
              <div>
                <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{c.cliente}</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: tokens.graphite600 }}>{c.projeto}</p>
              </div>
              <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite700 }}>{formatarMoeda(c.honorarios)}</span>
              <span style={{ fontSize: 12, color: tokens.graphite700 }}>{c.forma}</span>
              <Badge tone={c.status === 'em_vigor' ? 'neutral' : 'ghost'}>{c.status === 'em_vigor' ? 'Em vigor' : 'Encerrado'}</Badge>
            </div>
          ))}
        </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Parcerias
// ---------------------------------------------------------------------

function ParceriasView({ parcerias, onNovaParceria }) {
  return (
    <div>
      <TopBar eyebrow="Parcerias" titulo="Comissões e fornecedores" acao={<Botao onClick={onNovaParceria}><Plus size={14} strokeWidth={1.5} />Nova parceria</Botao>} />
      {parcerias.length === 0 ? (
        <EmptyState titulo="Nenhuma parceria cadastrada ainda." acaoLabel="Cadastrar a primeira parceria" onAcao={onNovaParceria} />
      ) : (
        <div className="hairline" style={{ background: tokens.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr 110px 120px 130px', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
            <span>Fornecedor</span><span>Cliente / Projeto</span><span>Orçamento nº</span><span>Valor total</span><span>Próx. pagamento</span>
          </div>
          {parcerias.map((p, i) => {
            const prox = proximoPagamentoParceria(p);
            const urgencia = calcularUrgenciaPrazo(prox);
            return (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1.2fr 110px 120px 130px', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: tokens.graphite900 }}>{p.fornecedor}</span>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: tokens.graphite800 }}>{p.cliente}</p>
                  {p.projeto && <p style={{ margin: '2px 0 0', fontSize: 11, color: tokens.graphite600 }}>{p.projeto}</p>}
                </div>
                <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{p.numeroOrcamento || '—'}</span>
                <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite700 }}>{formatarMoeda(totalParceria(p))}</span>
                <span className="font-mono" style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: urgencia.nivel === 'atrasado' ? tokens.alert : tokens.graphite600 }}>
                  {urgencia.nivel === 'atrasado' && <AlertTriangle size={11} strokeWidth={1.5} />}
                  {prox ? formatarData(prox) : 'Quitado'}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Orçamentos
// ---------------------------------------------------------------------

function OrcamentosView({ orcamentos, onNovoOrcamento }) {
  return (
    <div>
      <TopBar eyebrow="Orçamentos" titulo="Orçamentos enviados" acao={<Botao onClick={onNovoOrcamento}><Paperclip size={14} strokeWidth={1.5} />Novo orçamento</Botao>} />
      {orcamentos.length === 0 ? (
        <EmptyState titulo="Nenhum orçamento anexado ainda." acaoLabel="Anexar o primeiro orçamento" onAcao={onNovoOrcamento} />
      ) : (
        <div className="hairline" style={{ background: tokens.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 120px 90px', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
            <span>Orçamento</span><span>Cliente / Projeto</span><span>Enviado em</span><span>Arquivo</span>
          </div>
          {orcamentos.map((o, i) => (
            <div key={o.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 120px 90px', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
              <span style={{ fontSize: 13, color: tokens.graphite900 }}>{o.nome}</span>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: tokens.graphite800 }}>{o.cliente}</p>
                {o.projeto && <p style={{ margin: '2px 0 0', fontSize: 11, color: tokens.graphite600 }}>{o.projeto}</p>}
              </div>
              <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{formatarData(o.dataEnvio)}</span>
              {o.arquivoUrl ? (
                <a href={o.arquivoUrl} download={o.arquivoNome} style={{ fontSize: 12, color: tokens.chromeAccent }}>Baixar</a>
              ) : (
                <span style={{ fontSize: 12, color: tokens.graphite600 }}>—</span>
              )}
            </div>
          ))}
        </div>
      )}
      <p style={{ marginTop: 20, fontSize: 12, color: tokens.graphite600 }}>Essa aba ainda é uma primeira versão — vamos refinar juntos em breve.</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Vista: Equipe
// ---------------------------------------------------------------------

function EquipeView({ equipe, demandas, projetos, onNovoMembro }) {
  const [membroSelecionadoId, setMembroSelecionadoId] = useState(null);
  const membro = equipe.find((m) => m.id === membroSelecionadoId);

  if (membro) {
    const demandasDoMembro = demandas.filter((d) => d.responsavel === membro.nome && d.status !== 'Concluída');
    const porPrioridade = {
      Urgente: demandasDoMembro.filter((d) => d.prioridade === 'Urgente'),
      Alta: demandasDoMembro.filter((d) => d.prioridade === 'Alta'),
      Média: demandasDoMembro.filter((d) => d.prioridade === 'Média'),
      Baixa: demandasDoMembro.filter((d) => d.prioridade === 'Baixa'),
    };
    const projetosDoMembro = projetos.filter((p) => p.responsavel === membro.nome);

    return (
      <div>
        <button onClick={() => setMembroSelecionadoId(null)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', cursor: 'pointer', color: tokens.graphite600, fontSize: 12, marginBottom: 24 }}>
          <ArrowLeft size={14} strokeWidth={1.5} /> Voltar para a equipe
        </button>

        <TopBar eyebrow="Equipe" titulo={membro.nome} acao={<Badge tone="chrome">{membro.cargo}</Badge>} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
          <StatCard label="Demandas ativas" valor={String(demandasDoMembro.length).padStart(2, '0')} />
          <StatCard label="Projetos envolvido(a)" valor={String(projetosDoMembro.length).padStart(2, '0')} />
        </div>

        <div style={{ marginBottom: 40 }}>
          <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Demandas por prioridade</h2>
          {demandasDoMembro.length === 0 ? (
            <p className="hairline" style={{ background: tokens.surface, padding: '24px 16px', textAlign: 'center', fontSize: 12, color: tokens.graphite600 }}>Nenhuma demanda ativa.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {['Urgente', 'Alta', 'Média', 'Baixa'].map((p) => porPrioridade[p].length > 0 && (
                <div key={p}>
                  <p style={{ margin: '0 0 8px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: tokens.graphite600 }}>{p}</p>
                  <div className="hairline" style={{ background: tokens.surface }}>
                    {porPrioridade[p].map((d, i) => (
                      <div key={d.id} style={{ padding: '10px 16px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                        <p style={{ margin: 0, fontSize: 13, color: tokens.graphite900 }}>{d.titulo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 style={{ marginBottom: 16, fontSize: 15, fontWeight: 300, color: tokens.graphite900 }}>Projetos envolvido(a)</h2>
          {projetosDoMembro.length === 0 ? (
            <p className="hairline" style={{ background: tokens.surface, padding: '24px 16px', textAlign: 'center', fontSize: 12, color: tokens.graphite600 }}>Nenhum projeto no momento.</p>
          ) : (
            <div className="hairline" style={{ background: tokens.surface }}>
              {projetosDoMembro.map((p, i) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none' }}>
                  <span style={{ fontSize: 13, color: tokens.graphite900 }}>{p.nome}</span>
                  <span style={{ fontSize: 12, color: tokens.graphite600 }}>{p.cliente}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <TopBar eyebrow="Equipe" titulo="Integrantes do escritório" acao={<Botao onClick={onNovoMembro}><UserPlus size={14} strokeWidth={1.5} />Novo integrante</Botao>} />
      {equipe.length === 0 ? (
        <EmptyState titulo="Nenhum integrante cadastrado ainda." acaoLabel="Cadastrar o primeiro integrante" onAcao={onNovoMembro} />
      ) : (
        <div className="hairline" style={{ background: tokens.surface }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1.2fr 1fr', gap: 16, padding: '12px 24px', borderBottom: `1px solid ${tokens.border}`, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.graphite600 }}>
            <span>Nome</span><span>Cargo</span><span>E-mail</span><span>Telefone</span>
          </div>
          {equipe.map((m, i) => (
            <div key={m.id} onClick={() => setMembroSelecionadoId(m.id)} style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr 1.2fr 1fr', gap: 16, alignItems: 'center', padding: '14px 24px', borderTop: i !== 0 ? `1px solid ${tokens.border}` : 'none', cursor: 'pointer' }}>
              <span style={{ fontSize: 13, color: tokens.graphite900 }}>{m.nome}</span>
              <span style={{ fontSize: 12, color: tokens.graphite700 }}>{m.cargo}</span>
              <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{m.email || '—'}</span>
              <span className="font-mono" style={{ fontSize: 12, color: tokens.graphite600 }}>{m.telefone || '—'}</span>
            </div>
          ))}
        </div>
      )}
      <p style={{ marginTop: 20, fontSize: 12, color: tokens.graphite600 }}>Em breve: login e senha próprios para cada integrante, com permissões de acesso configuráveis.</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------

export default function PlatformApp({ usuario }) {
  const [navAtivo, setNavAtivo] = useState('painel');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [clientes, setClientes] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [demandas, setDemandas] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [equipe, setEquipe] = useState([]);
  const [parcerias, setParcerias] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);

  const [modalCliente, setModalCliente] = useState(false);
  const [modalProjeto, setModalProjeto] = useState(false);
  const [modalDemanda, setModalDemanda] = useState(false);
  const [modalContrato, setModalContrato] = useState(false);
  const [modalParceria, setModalParceria] = useState(false);
  const [modalMembro, setModalMembro] = useState(false);
  const [modalOrcamento, setModalOrcamento] = useState(false);
  const [demandaSelecionadaId, setDemandaSelecionadaId] = useState(null);

  const navSeguro = navAtivo === 'financeiro' && !usuario.ehAdminFinanceiro ? 'painel' : navAtivo;

  // Carrega tudo do Supabase ao abrir a plataforma. Contratos e
  // parcerias só são buscados para quem tem a flag de admin financeiro
  // — para os demais, a RLS do banco já devolveria vazio mesmo assim,
  // mas evitamos a chamada desnecessária.
  useEffect(() => {
    let cancelado = false;

    async function carregarTudo() {
      try {
        const [c, p, d, eq, orc, notif] = await Promise.all([
          dataApi.clientes.listar(),
          dataApi.projetos.listar(),
          dataApi.demandas.listar(),
          dataApi.equipe.listar(),
          dataApi.orcamentos.listar(),
          dataApi.notificacoes.listar(),
        ]);
        if (cancelado) return;
        setClientes(c);
        setProjetos(p);
        setDemandas(d);
        setEquipe(eq);
        setOrcamentos(orc);
        setNotificacoes(notif);

        if (usuario.ehAdminFinanceiro) {
          const [ct, pc] = await Promise.all([dataApi.contratos.listar(), dataApi.parcerias.listar()]);
          if (cancelado) return;
          setContratos(ct);
          setParcerias(pc);
        }
      } catch (e) {
        console.error(e);
        if (!cancelado) setErro('Não foi possível carregar os dados do banco. Tente recarregar a página.');
      } finally {
        if (!cancelado) setCarregando(false);
      }
    }

    carregarTudo();
    return () => { cancelado = true; };
  }, [usuario.ehAdminFinanceiro]);

  function notificarLocal(mensagem) {
    // Otimista: mostra na hora, mesmo antes do banco confirmar.
    setNotificacoes((atual) => [...atual, { id: `tmp-${Date.now()}`, mensagem, lida: false, data: dataDeHojeISO() }]);
    dataApi.notificacoes.inserir({ mensagem, lida: false, data: dataDeHojeISO() }).catch((e) => console.error(e));
  }

  async function cadastrarCliente(c) {
    try {
      const novo = await dataApi.clientes.inserir(c);
      setClientes((atual) => [...atual, novo]);
      notificarLocal(`Novo cliente cadastrado: ${novo.nome}`);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar o cliente. Tente novamente.');
    }
  }

  async function excluirCliente(id) {
    const anterior = clientes;
    setClientes((atual) => atual.filter((c) => c.id !== id));
    try {
      await dataApi.clientes.excluir(id);
    } catch (e) {
      console.error(e);
      setClientes(anterior);
      alert('Não foi possível excluir o cliente.');
    }
  }

  async function cadastrarProjeto(p) {
    try {
      const novo = await dataApi.projetos.inserir(p);
      setProjetos((atual) => [...atual, novo]);
      notificarLocal(`Novo projeto cadastrado: ${novo.nome}`);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar o projeto. Tente novamente.');
    }
  }

  function atualizarProjeto(id, patch) {
    // Otimista primeiro — o Kanban e as abas do projeto respondem na
    // hora — depois grava no banco. Se falhar, é só um log por ora
    // (evita travar a tela por causa de uma revisão/foto perdida).
    setProjetos((atual) => atual.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    dataApi.projetos.atualizar(id, patch).catch((e) => console.error(e));
  }

  async function cadastrarDemanda(d) {
    try {
      const nova = await dataApi.demandas.inserir(d);
      setDemandas((atual) => [...atual, nova]);
      notificarLocal(`Nova demanda: ${nova.titulo}`);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar a demanda. Tente novamente.');
    }
  }

  function concluirDemanda(id) {
    setDemandas((atual) => atual.map((d) => (d.id === id ? { ...d, status: 'Concluída' } : d)));
    setDemandaSelecionadaId(null);
    dataApi.demandas.atualizar(id, { status: 'Concluída' }).catch((e) => console.error(e));
  }

  function excluirDemanda(id) {
    setDemandas((atual) => atual.filter((d) => d.id !== id));
    setDemandaSelecionadaId(null);
    dataApi.demandas.excluir(id).catch((e) => console.error(e));
  }

  async function cadastrarContrato(c) {
    try {
      const novo = await dataApi.contratos.inserir(c);
      setContratos((atual) => [...atual, novo]);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar o contrato. Tente novamente.');
    }
  }

  async function cadastrarParceria(p) {
    try {
      const nova = await dataApi.parcerias.inserir(p);
      setParcerias((atual) => [...atual, nova]);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar a parceria. Tente novamente.');
    }
  }

  async function cadastrarMembro(m) {
    try {
      const novo = await dataApi.equipe.inserir(m);
      setEquipe((atual) => [...atual, novo]);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar o integrante. Tente novamente.');
    }
  }

  async function cadastrarOrcamento(o) {
    try {
      const novo = await dataApi.orcamentos.inserir(o);
      setOrcamentos((atual) => [...atual, novo]);
    } catch (e) {
      console.error(e);
      alert('Não foi possível salvar o orçamento. Tente novamente.');
    }
  }

  function marcarNotificacoesLidas() {
    setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true })));
    dataApi.notificacoes.marcarTodasLidas().catch((e) => console.error(e));
  }

  const demandaSelecionada = demandas.find((d) => d.id === demandaSelecionadaId) || null;
  const projetoDaDemandaSelecionada = demandaSelecionada ? projetos.find((p) => p.id === demandaSelecionada.projetoId) : null;

  if (carregando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: tokens.bg, fontFamily: "'Manrope', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400&display=swap');`}</style>
        <p style={{ fontSize: 13, color: tokens.graphite600 }}>Carregando plataforma…</p>
      </div>
    );
  }

  const views = {
    painel: (
      <PainelGeralView
        demandas={demandas}
        projetos={projetos}
        clientes={clientes}
        notificacoes={notificacoes}
        onMarcarNotificacoesLidas={marcarNotificacoesLidas}
        onNovaDemanda={() => setModalDemanda(true)}
        onAbrirDemanda={setDemandaSelecionadaId}
      />
    ),
    clientes: (
      <ClientesView
        clientes={clientes}
        contratos={contratos}
        parcerias={parcerias}
        onNovoCliente={() => setModalCliente(true)}
        onExcluirCliente={excluirCliente}
      />
    ),
    projetos: (
      <ProjetosModulo
        projetos={projetos}
        setProjetos={setProjetos}
        contratos={contratos}
        demandas={demandas}
        equipe={equipe}
        onNovoProjeto={() => setModalProjeto(true)}
        onAtualizarProjeto={atualizarProjeto}
        onAbrirDemanda={setDemandaSelecionadaId}
      />
    ),
    demandas: <DemandasView demandas={demandas} projetos={projetos} onNovaDemanda={() => setModalDemanda(true)} onAbrirDemanda={setDemandaSelecionadaId} />,
    parcerias: <ParceriasView parcerias={parcerias} onNovaParceria={() => setModalParceria(true)} />,
    orcamentos: <OrcamentosView orcamentos={orcamentos} onNovoOrcamento={() => setModalOrcamento(true)} />,
    equipe: <EquipeView equipe={equipe} demandas={demandas} projetos={projetos} onNovoMembro={() => setModalMembro(true)} />,
    financeiro: <FinanceiroView contratos={contratos} clientes={clientes} projetos={projetos} onNovoContrato={() => setModalContrato(true)} />,
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: tokens.bg, fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        .hairline { border: 1px solid ${tokens.border}; }
        .nav-item { transition: color .15s ease; cursor: pointer; }
        .btn-primary { background: ${tokens.graphite900}; color: ${tokens.bg}; border: none; cursor: pointer; transition: background .15s ease; }
        .btn-primary:hover { background: ${tokens.graphite800}; }
        .btn-secondary { background: transparent; color: ${tokens.graphite900}; border: 1px solid ${tokens.border}; cursor: pointer; transition: border-color .15s ease; }
        .btn-secondary:hover { border-color: ${tokens.graphite900}; }
        input, select, textarea { font-family: 'Manrope', sans-serif; }
      `}</style>

      <aside style={{ width: 232, flexShrink: 0, background: tokens.graphite900, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div
            onClick={() => setNavAtivo('painel')}
            title="Ir para o Painel geral"
            style={{ display: 'flex', alignItems: 'center', padding: '26px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}
          >
            <img src={LOGO_SRC} alt="Logo do escritório" style={{ height: 20, width: 'auto', filter: 'invert(1) brightness(2)' }} />
          </div>
          <nav style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 2, padding: '0 12px' }}>
            {NAV_ITEMS.filter((item) => item.key !== 'financeiro' || usuario.ehAdminFinanceiro).map(({ key, label, icon: Icon }) => {
              const ativo = navAtivo === key;
              return (
                <div key={key} className="nav-item" onClick={() => setNavAtivo(key)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', fontSize: 13, letterSpacing: '0.02em', color: ativo ? tokens.bg : 'rgba(242,242,243,0.45)' }}>
                  <span style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: 1, background: ativo ? tokens.chromeAccent : 'transparent' }} />
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </div>
              );
            })}
          </nav>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '18px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="font-mono" style={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.1)', color: tokens.bg, fontSize: 11 }}>
              {usuario.nome.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.3, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13, color: tokens.bg }}>{usuario.nome}</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(242,242,243,0.5)' }}>{usuario.cargo || 'Equipe'}</p>
            </div>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '40px 44px', minWidth: 0 }}>
        {erro && (
          <div className="hairline" style={{ background: tokens.alertSoft, color: tokens.alert, padding: '12px 16px', fontSize: 13, marginBottom: 24 }}>
            {erro}
          </div>
        )}
        {views[navSeguro]}
      </main>

      {modalCliente && <NovoClienteModal onFechar={() => setModalCliente(false)} onSalvar={cadastrarCliente} />}
      {modalProjeto && <NovoProjetoModal clientes={clientes} equipe={equipe} onFechar={() => setModalProjeto(false)} onSalvar={cadastrarProjeto} />}
      {modalDemanda && <NovaDemandaModal projetos={projetos} equipe={equipe} onFechar={() => setModalDemanda(false)} onSalvar={cadastrarDemanda} />}
      {modalContrato && <NovoContratoModal clientes={clientes} projetos={projetos} onFechar={() => setModalContrato(false)} onSalvar={cadastrarContrato} />}
      {modalParceria && <NovaParceriaModal clientes={clientes} projetos={projetos} onFechar={() => setModalParceria(false)} onSalvar={cadastrarParceria} />}
      {modalMembro && <NovoMembroModal onFechar={() => setModalMembro(false)} onSalvar={cadastrarMembro} />}
      {modalOrcamento && <NovoOrcamentoModal clientes={clientes} projetos={projetos} onFechar={() => setModalOrcamento(false)} onSalvar={cadastrarOrcamento} />}

      {demandaSelecionada && (
        <DetalheDemandaModal
          demanda={demandaSelecionada}
          projeto={projetoDaDemandaSelecionada}
          onFechar={() => setDemandaSelecionadaId(null)}
          onConcluir={concluirDemanda}
          onExcluir={excluirDemanda}
        />
      )}
    </div>
  );
}
