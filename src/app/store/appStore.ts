"use client";
import { create } from 'zustand';

export type Tab = 'inicio' | 'jornada' | 'busca' | 'notificacoes' | 'perfil';
export type Screen = 'home' | 'jornada' | 'busca' | 'notificacoes' | 'perfil' | 'onboarding' | 'nova-jornada' | 'detalhe-jornada' | 'insight';

export interface Jornada {
  id: string;
  sonho: string;
  icon: string;
  valor: number;
  prazo: number; // meses
  acumulado: number;
  capitulo: number;
  score: number;
  criada: string;
  descricao: string;
  cor: string;
  insights: Insight[];
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

  setTab: (tab: Tab) => void;
  setScreen: (screen: Screen) => void;
  nextOnboardingStep: () => void;
  completeOnboarding: () => void;
  toggleSaldo: () => void;
  setJornadaDetalhe: (j: Jornada | null) => void;
  adicionarJornada: (j: Jornada) => void;
  marcarInsightLido: (id: string) => void;
  addAiMessage: (msg: { role: 'ai' | 'user'; text: string }) => void;
  setAiTyping: (v: boolean) => void;
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
};

const mockTransacoes: Transacao[] = [
  { id: '1', descricao: 'iFood', valor: 89.90, tipo: 'debito', categoria: 'Alimentação', data: 'hoje' },
  { id: '2', descricao: 'Salário', valor: 5800, tipo: 'credito', categoria: 'Renda', data: 'ontem' },
  { id: '3', descricao: 'Netflix', valor: 39.90, tipo: 'debito', categoria: 'Assinaturas', data: '2 dias' },
  { id: '4', descricao: 'Poupança Jornada', valor: 600, tipo: 'debito', categoria: 'Meta', data: '3 dias' },
  { id: '5', descricao: 'Supermercado', valor: 312.40, tipo: 'debito', categoria: 'Alimentação', data: '4 dias' },
];

export const useAppStore = create<AppState>((set) => ({
  tab: 'inicio',
  screen: 'home',
  onboardingStep: 0,
  hasOnboarded: true,
  jornadaAtiva: mockJornada,
  jornadas: [mockJornada],
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

  setTab: (tab) => set({ tab }),
  setScreen: (screen) => set({ screen }),
  nextOnboardingStep: () => set((s) => ({ onboardingStep: s.onboardingStep + 1 })),
  completeOnboarding: () => set({ hasOnboarded: true, screen: 'jornada', tab: 'jornada' }),
  toggleSaldo: () => set((s) => ({ saldoVisible: !s.saldoVisible })),
  setJornadaDetalhe: (j) => set({ jornadaDetalhe: j }),
  adicionarJornada: (j) => set((s) => ({ jornadas: [...s.jornadas, j], jornadaAtiva: j })),
  marcarInsightLido: (id) => set((s) => ({
    notificacoes: s.notificacoes.map(n => n.id === id ? { ...n, lido: true } : n),
  })),
  addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),
  setAiTyping: (v) => set({ aiTyping: v }),
}));
