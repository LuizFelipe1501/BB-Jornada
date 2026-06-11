"use client";
import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export type Tab = 'inicio' | 'jornada' | 'busca' | 'notificacoes' | 'perfil';
export type Screen = 'home' | 'jornada' | 'busca' | 'notificacoes' | 'perfil' | 'onboarding' | 'nova-jornada' | 'detalhe-jornada' | 'insight';

export interface Jornada {
  id: string;
  sonho: string;
  icon: string;
  valor: number | null;
  prazo: number | null; // meses
  acumulado: number;
  capitulo: number;
  score: number;
  criada: string;
  descricao: string;
  cor: string;
  insights: Insight[];
  meta_livre: boolean;
  trilha_status?: Record<string, { completedTasks: string[]; quizCompleted: boolean; quizAnswer?: number }>;
}

export interface Insight {
  id: string;
  tipo: 'positivo' | 'alerta' | 'oportunidade' | 'previsao';
  texto: string;
  acao?: string;
  lido: boolean;
  data: string;
}

export interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'debito' | 'credito';
  categoria: string;
  data: string;
}

export interface AppState {
  tab: Tab;
  screen: Screen;
  onboardingStep: number;
  hasOnboarded: boolean;
  jornadaAtiva: Jornada | null;
  jornadas: Jornada[];
  transacoes: Transacao[];
  notificacoes: Insight[];
  saldoVisible: boolean;
  saldo: number;
  nome: string;
  rendaMensal: number;
  gastosMensais: number;
  aiTyping: boolean;
  aiMessages: { role: 'ai' | 'user'; text: string }[];
  jornadaDetalhe: Jornada | null;

  activeDetalheTab: 'mentor' | 'grafico' | 'gastos';
  setActiveDetalheTab: (tab: 'mentor' | 'grafico' | 'gastos') => void;

  // Supabase states
  userId: string | null;
  loadingDatabase: boolean;

  setTab: (tab: Tab) => void;
  setScreen: (screen: Screen) => void;
  nextOnboardingStep: () => void;
  completeOnboarding: () => void;
  toggleSaldo: () => void;
  setJornadaDetalhe: (j: Jornada | null) => void;
  adicionarJornada: (j: Jornada) => Promise<void>;
  marcarInsightLido: (id: string) => Promise<void>;
  marcarTodosInsightsLidos: () => Promise<void>;
  addAiMessage: (msg: { role: 'ai' | 'user'; text: string }) => void;
  setAiTyping: (v: boolean) => void;

  // Supabase methods
  initializeUserSession: () => Promise<void>;
  resetUserSession: () => void;
  saveJornadaState: (jornada: Jornada) => Promise<void>;
  updateJornadaAcumulado: (valorAdicional: number) => Promise<void>;
  updateJornadaScore: (novoScore: number) => Promise<void>;
  updateJornadaCapitulo: (novoCapitulo: number) => Promise<void>;
}

const mockInsights: Insight[] = [
  {
    id: '1',
    tipo: 'positivo',
    texto: 'Você está 8% à frente da meta do mês. Continue assim!',
    acao: 'Ver detalhes',
    lido: false,
    data: 'hoje',
  },
  {
    id: '2',
    tipo: 'alerta',
    texto: 'Seu gasto com delivery aumentou 20% esta semana. Isso pode atrasar sua jornada em 3 dias.',
    acao: 'Como economizar',
    lido: false,
    data: 'ontem',
  },
  {
    id: '3',
    tipo: 'previsao',
    texto: 'Se manter o ritmo atual, você alcançará sua meta dois meses antes do prazo.',
    acao: 'Simular cenários',
    lido: true,
    data: '3 dias atrás',
  },
  {
    id: '4',
    tipo: 'oportunidade',
    texto: 'Detectei R$ 380 em gastos com assinaturas que você não usa. Posso ajudar a cancelar?',
    acao: 'Ver assinaturas',
    lido: false,
    data: '5 dias atrás',
  },
];

const mockJornada: Jornada = {
  id: '1',
  sonho: 'Comprar meu carro',
  icon: '🚗',
  valor: 35000,
  prazo: 24,
  acumulado: 14200,
  capitulo: 3,
  score: 72,
  criada: '2024-01-15',
  descricao: 'Quero comprar um Onix 2024 à vista para não pagar juros',
  cor: '#0033A0',
  insights: mockInsights,
  meta_livre: false,
  trilha_status: {}
};

const mockTransacoes: Transacao[] = [
  { id: '1', descricao: 'iFood (Débito)', valor: 89.90, tipo: 'debito', categoria: 'Alimentação', data: 'hoje' },
  { id: '2', descricao: 'Salário', valor: 5800, tipo: 'credito', categoria: 'Renda', data: 'ontem' },
  { id: '3', descricao: 'Assinatura Netflix (Cartão)', valor: 39.90, tipo: 'debito', categoria: 'Assinaturas', data: '2 dias atrás' },
  { id: '4', descricao: 'Poupança Jornada', valor: 600, tipo: 'debito', categoria: 'Meta', data: '3 dias atrás' },
  { id: '5', descricao: 'Supermercado (Débito)', valor: 312.40, tipo: 'debito', categoria: 'Alimentação', data: '4 dias atrás' },
  { id: '6', descricao: 'Fatura de Cartão (Vestuário)', valor: 250.00, tipo: 'debito', categoria: 'Vestuário', data: '5 dias atrás' },
  { id: '7', descricao: 'Pix enviado para João (Transferência)', valor: 150.00, tipo: 'debito', categoria: 'Transferência', data: '6 dias atrás' },
  { id: '8', descricao: 'Pix recebido de Maria (Reembolso)', valor: 80.00, tipo: 'credito', categoria: 'Transferência', data: '7 dias atrás' },
  { id: '9', descricao: 'Uber (Cartão)', valor: 24.90, tipo: 'debito', categoria: 'Transporte', data: 'hoje' },
  { id: '10', descricao: 'Assinatura Spotify (Cartão)', valor: 34.90, tipo: 'debito', categoria: 'Assinaturas', data: '2 dias atrás' }
];

export const useAppStore = create<AppState>((set, get) => ({
  tab: 'inicio',
  screen: 'home',
  onboardingStep: 0,
  hasOnboarded: true,
  jornadaAtiva: null,
  jornadas: [],
  transacoes: mockTransacoes,
  notificacoes: mockInsights,
  saldoVisible: false,
  saldo: 3847.50,
  nome: 'Luiz',
  rendaMensal: 5800,
  gastosMensais: 4100,
  aiTyping: false,
  aiMessages: [],
  jornadaDetalhe: null,
  activeDetalheTab: 'mentor',

  userId: null,
  loadingDatabase: false,

  setTab: (tab) => set({ tab }),
  setScreen: (screen) => set({ screen }),
  nextOnboardingStep: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),
  completeOnboarding: () => set({ hasOnboarded: true, screen: 'jornada', tab: 'jornada' }),
  toggleSaldo: () => set((s) => ({ saldoVisible: !s.saldoVisible })),
  setJornadaDetalhe: (j) => set({ jornadaDetalhe: j }),
  setActiveDetalheTab: (activeDetalheTab) => set({ activeDetalheTab }),
  
  adicionarJornada: async (j) => {
    const { userId } = get();
    set((s) => ({ jornadas: [...s.jornadas, j], jornadaAtiva: j, notificacoes: j.insights || [] }));
    
    if (userId) {
      try {
        await supabase.from('jornadas').insert({
          id: j.id,
          jurado_nome: userId,
          sonho: j.sonho,
          icon: j.icon,
          valor: j.valor,
          prazo: j.prazo,
          acumulado: j.acumulado,
          capitulo: j.capitulo,
          score: j.score,
          descricao: j.descricao,
          cor: j.cor,
          meta_livre: j.meta_livre,
          insights: j.insights,
          trilha_status: j.trilha_status || {}
        });
      } catch (err) {
        console.error('Erro ao adicionar jornada no Supabase:', err);
      }
    }
  },
  
  marcarInsightLido: async (id) => {
    const { jornadaAtiva, notificacoes, jornadas } = get();
    const updatedNotificacoes = notificacoes.map(n => n.id === id ? { ...n, lido: true } : n);
    set({ notificacoes: updatedNotificacoes });

    if (jornadaAtiva) {
      const updatedInsights = jornadaAtiva.insights.map(n => n.id === id ? { ...n, lido: true } : n);
      const updatedJornada = { ...jornadaAtiva, insights: updatedInsights };
      const updatedJornadas = jornadas.map(j => j.id === jornadaAtiva.id ? updatedJornada : j);
      set({
        jornadaAtiva: updatedJornada,
        jornadas: updatedJornadas
      });
      try {
        await supabase.from('jornadas').update({
          insights: updatedInsights
        }).eq('id', jornadaAtiva.id);
      } catch (err) {
        console.error('Erro ao atualizar insight lido no Supabase:', err);
      }
    }
  },

  marcarTodosInsightsLidos: async () => {
    const { jornadaAtiva, notificacoes, jornadas } = get();
    const hasUnread = notificacoes.some(n => !n.lido);
    if (!hasUnread) return;

    const updatedNotificacoes = notificacoes.map(n => ({ ...n, lido: true }));
    set({ notificacoes: updatedNotificacoes });

    if (jornadaAtiva) {
      const updatedInsights = jornadaAtiva.insights.map(n => ({ ...n, lido: true }));
      const updatedJornada = { ...jornadaAtiva, insights: updatedInsights };
      const updatedJornadas = jornadas.map(j => j.id === jornadaAtiva.id ? updatedJornada : j);
      set({
        jornadaAtiva: updatedJornada,
        jornadas: updatedJornadas
      });
      try {
        await supabase.from('jornadas').update({
          insights: updatedInsights
        }).eq('id', jornadaAtiva.id);
      } catch (err) {
        console.error('Erro ao atualizar todos os insights no Supabase:', err);
      }
    }
  },
  addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),
  setAiTyping: (v) => set({ aiTyping: v }),

  initializeUserSession: async () => {
    if (typeof window === 'undefined') return;

    let localId = localStorage.getItem('bb_jornada_user_id');
    let localName = localStorage.getItem('bb_jornada_user_name');

    if (!localId) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      localId = `user_${Date.now()}_${randomSuffix}`;
      localName = `Luiz ${randomSuffix}`; // Nome BB padrão + ID para identificar jurados e público
      localStorage.setItem('bb_jornada_user_id', localId);
      localStorage.setItem('bb_jornada_user_name', localName);
    }

    set({ userId: localId, nome: localName || 'Luiz', loadingDatabase: true });

    try {
      const { data, error } = await supabase
        .from('jornadas')
        .select('*')
        .eq('jurado_nome', localId)
        .order('criada', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const fetchedJornadas: Jornada[] = data.map((d: any) => ({
          id: d.id,
          sonho: d.sonho,
          icon: d.icon,
          valor: d.valor !== null ? Number(d.valor) : null,
          prazo: d.prazo !== null ? Number(d.prazo) : null,
          acumulado: Number(d.acumulado),
          capitulo: Number(d.capitulo),
          score: Number(d.score),
          criada: d.criada,
          descricao: d.descricao || '',
          cor: d.cor || '#0033A0',
          insights: d.insights || [],
          meta_livre: d.meta_livre || false,
          trilha_status: d.trilha_status || {}
        }));

        set({
          jornadas: fetchedJornadas,
          jornadaAtiva: fetchedJornadas[0],
          notificacoes: fetchedJornadas[0].insights || [],
          loadingDatabase: false
        });
      } else {
        // Cria jornada padrão ativa para o novo usuário
        const newJ: Jornada = {
          id: Date.now().toString(),
          sonho: 'Comprar meu carro',
          icon: '🚗',
          valor: 35000,
          prazo: 24,
          acumulado: 14200,
          capitulo: 3,
          score: 72,
          criada: new Date().toISOString(),
          descricao: 'Quero comprar um Onix 2024 à vista para não pagar juros',
          cor: '#0033A0',
          insights: mockInsights,
          meta_livre: false,
          trilha_status: {}
        };

        const { error: insertErr } = await supabase.from('jornadas').insert({
          id: newJ.id,
          jurado_nome: localId,
          sonho: newJ.sonho,
          icon: newJ.icon,
          valor: newJ.valor,
          prazo: newJ.prazo,
          acumulado: newJ.acumulado,
          capitulo: newJ.capitulo,
          score: newJ.score,
          descricao: newJ.descricao,
          cor: newJ.cor,
          meta_livre: newJ.meta_livre,
          insights: newJ.insights,
          trilha_status: newJ.trilha_status
        });

        if (insertErr) throw insertErr;

        set({
          jornadas: [newJ],
          jornadaAtiva: newJ,
          notificacoes: newJ.insights || [],
          loadingDatabase: false
        });
      }
    } catch (err) {
      console.error('Erro ao buscar/criar jurado no Supabase:', err);
      // Fallback local
      set({
        jornadaAtiva: mockJornada,
        jornadas: [mockJornada],
        notificacoes: mockJornada.insights || [],
        loadingDatabase: false
      });
    }
  },

  resetUserSession: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('bb_jornada_user_id');
    localStorage.removeItem('bb_jornada_user_name');
    window.location.reload();
  },

  saveJornadaState: async (jornada) => {
    set((s) => ({
      jornadas: s.jornadas.map(j => j.id === jornada.id ? jornada : j),
      jornadaAtiva: s.jornadaAtiva?.id === jornada.id ? jornada : s.jornadaAtiva
    }));

    try {
      await supabase.from('jornadas').update({
        acumulado: jornada.acumulado,
        capitulo: jornada.capitulo,
        score: jornada.score,
        trilha_status: jornada.trilha_status || {}
      }).eq('id', jornada.id);
    } catch (err) {
      console.error('Erro ao salvar estado da jornada no Supabase:', err);
    }
  },

  updateJornadaAcumulado: async (valorAdicional) => {
    const { jornadaAtiva, saveJornadaState } = get();
    if (!jornadaAtiva) return;

    const updated = {
      ...jornadaAtiva,
      acumulado: Math.max(0, jornadaAtiva.acumulado + valorAdicional)
    };
    await saveJornadaState(updated);
  },

  updateJornadaScore: async (novoScore) => {
    const { jornadaAtiva, saveJornadaState } = get();
    if (!jornadaAtiva) return;

    const updated = {
      ...jornadaAtiva,
      score: Math.min(100, Math.max(0, novoScore))
    };
    await saveJornadaState(updated);
  },

  updateJornadaCapitulo: async (novoCapitulo) => {
    const { jornadaAtiva, saveJornadaState } = get();
    if (!jornadaAtiva) return;

    const updated = {
      ...jornadaAtiva,
      capitulo: novoCapitulo
    };
    await saveJornadaState(updated);
  }
}));
