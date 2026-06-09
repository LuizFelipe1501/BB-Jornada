"use client";
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Send, TrendingUp, TrendingDown } from 'lucide-react';

const quickPrompts = [
  'Estou indo bem?',
  'Como acelerar minha meta?',
  'Onde posso economizar?',
  'Qual meu próximo passo?',
];

const aiResponses: Record<string, string> = {
  'Estou indo bem?': 'Sim! Você está 8% acima da meta mensal. Seu padrão de disciplina nas últimas 6 semanas é consistente. Se mantiver esse ritmo, chegará ao seu objetivo 2 meses antes do previsto. 🎯',
  'Como acelerar minha meta?': 'Identifiquei 3 caminhos para acelerar: (1) Você tem R$ 380/mês em assinaturas pouco usadas. (2) Seus gastos com delivery aumentaram 20% — cortar pela metade libera ~R$ 90/mês. (3) Em dezembro, você costuma ter 13º — poderia destinar parte diretamente à meta. Quer que eu crie um plano detalhado? 💡',
  'Onde posso economizar?': 'Analisando seus últimos 3 meses, encontrei: \n\n🔴 Delivery: R$ 450/mês (acima da média)\n🟡 Assinaturas: R$ 180/mês (6 serviços)\n🟡 Supermercado: R$ 890/mês (pode otimizar)\n\nSó no delivery e assinaturas, você pode liberar R$ 330/mês sem impacto real na qualidade de vida.',
  'Qual meu próximo passo?': 'Você está no Capítulo 3: Construindo Reservas. Para avançar ao Capítulo 4, precisa: \n\n✅ Manter a meta por mais 2 meses\n⬜ Criar um fundo de emergência de 3x sua renda\n⬜ Eliminar as assinaturas desnecessárias\n\nFoco no mês que vem: fundo de emergência primeiro. Quer que eu configure um alerta automático?',
};

interface Message {
  role: 'ai' | 'user';
  text: string;
  time: string;
}

export default function DetalheJornadaScreen() {
  const { jornadaAtiva, setScreen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Olá! Sou o BB Mentor, seu guia financeiro pessoal. Estou acompanhando sua jornada "${jornadaAtiva?.sonho}" desde o início. Você está no caminho certo — 8% acima da meta! O que você quer saber?`,
      time: 'agora',
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<'mentor' | 'grafico' | 'gastos'>('mentor');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    const userMsg: Message = { role: 'user', text, time: 'agora' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const response = aiResponses[text] || `Ótima pergunta sobre "${text}". Com base no seu histórico financeiro, vejo que você tem potencial para otimizar ainda mais sua jornada. Me dê mais detalhes sobre o que você quer entender! 🤖`;
      setMessages(prev => [...prev, { role: 'ai', text: response, time: 'agora' }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const jornadaInfo = jornadaAtiva;
  if (!jornadaInfo) return null;

  const porcentagem = Math.round((jornadaInfo.acumulado / jornadaInfo.valor) * 100);

  const gastosData = [
    { cat: 'Alimentação', valor: 890, limite: 800, icon: '🍔' },
    { cat: 'Delivery', valor: 450, limite: 300, icon: '🛵' },
    { cat: 'Assinaturas', valor: 180, limite: 100, icon: '📱' },
    { cat: 'Transporte', valor: 320, limite: 350, icon: '🚌' },
    { cat: 'Lazer', valor: 280, limite: 300, icon: '🎮' },
  ];

  const evoluçãoMeses = [
    { mes: 'Jan', valor: 600 },
    { mes: 'Fev', valor: 700 },
    { mes: 'Mar', valor: 550 },
    { mes: 'Abr', valor: 750 },
    { mes: 'Mai', valor: 820 },
    { mes: 'Jun', valor: 780 },
  ];
  const maxVal = Math.max(...evoluçãoMeses.map(m => m.valor));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: '#0033A0', padding: '14px 16px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <button onClick={() => setScreen('jornada')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: '#FFCC00', fontSize: 12, fontWeight: 700 }}>JORNADA ATIVA</p>
            <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 16 }}>{jornadaInfo.icon} {jornadaInfo.sonho}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 18 }}>{porcentagem}%</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>concluído</p>
          </div>
        </div>

        {/* Mini progress */}
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, height: 6, marginBottom: 12 }}>
          <div style={{ width: `${porcentagem}%`, background: '#FFCC00', height: '100%', borderRadius: 6 }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {[
            { id: 'mentor', label: '🤖 Mentor' },
            { id: 'grafico', label: '📊 Evolução' },
            { id: 'gastos', label: '💸 Gastos' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: activeTab === t.id ? '#FFCC00' : 'rgba(255,255,255,0.65)',
                fontWeight: activeTab === t.id ? 700 : 500,
                fontSize: 13,
                padding: '8px 4px',
                cursor: 'pointer',
                borderBottom: activeTab === t.id ? '2px solid #FFCC00' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo das tabs */}
      {activeTab === 'mentor' && (
        <>
          {/* Messages */}
          <div className="scrollable" style={{ flex: 1, padding: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
              }}>
                {msg.role === 'ai' && (
                  <div style={{ width: 32, height: 32, borderRadius: 16, background: '#FFCC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, marginRight: 8, flexShrink: 0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: msg.role === 'user' ? '#0033A0' : '#F0F4FF',
                  color: msg.role === 'user' ? 'white' : '#1A1A1A',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 16, background: '#FFCC00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🤖</div>
                <div style={{ background: '#F0F4FF', borderRadius: '16px 16px 16px 4px', padding: '12px 16px', display: 'flex', gap: 6, alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} className="typing-dot" style={{ width: 8, height: 8, borderRadius: 4, background: '#9E9E9E' }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, overflowX: 'auto' }}>
            {quickPrompts.map(p => (
              <button key={p} onClick={() => sendMessage(p)} style={{
                flexShrink: 0,
                background: '#EEF2FF',
                border: '1px solid #C5D0F0',
                borderRadius: 20,
                padding: '6px 12px',
                fontSize: 12,
                color: '#0033A0',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}>{p}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && input.trim() && sendMessage(input.trim())}
              placeholder="Pergunte ao BB Mentor..."
              style={{
                flex: 1,
                border: '1.5px solid #E0E0E0',
                borderRadius: 24,
                padding: '10px 16px',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => input.trim() && sendMessage(input.trim())}
              style={{
                width: 44, height: 44, borderRadius: 22,
                background: input.trim() ? '#0033A0' : '#E0E0E0',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </>
      )}

      {activeTab === 'grafico' && (
        <div className="scrollable" style={{ flex: 1, padding: 16 }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16 }}>Evolução mensal</p>
          <div style={{ background: '#F0F4FF', borderRadius: 14, padding: '16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {evoluçãoMeses.map(m => {
                const height = (m.valor / maxVal) * 120;
                return (
                  <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: '#0033A0', fontWeight: 700 }}>
                      {m.valor >= 700 ? '+' : ''}{m.valor}
                    </span>
                    <div style={{ width: '100%', height, background: m.mes === 'Mai' ? '#FFCC00' : '#0033A0', borderRadius: '6px 6px 0 0' }} />
                    <span style={{ fontSize: 11, color: '#6B6B6B' }}>{m.mes}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <div style={{ background: '#F0FFF4', borderRadius: 12, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TrendingUp size={16} color="#00A651" />
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>Melhor mês</span>
              </div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#00A651' }}>R$ 820</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B6B6B' }}>Maio/2025</p>
            </div>
            <div style={{ background: '#FFF8E7', borderRadius: 12, padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TrendingDown size={16} color="#FF8C00" />
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>Média mensal</span>
              </div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#FF8C00' }}>R$ 700</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B6B6B' }}>últimos 6 meses</p>
            </div>
          </div>

          <div style={{ marginTop: 16, background: '#EEF2FF', borderRadius: 14, padding: '14px 16px', borderLeft: '4px solid #0033A0' }}>
            <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#0033A0' }}>🔮 Previsão do Mentor</p>
            <p style={{ margin: 0, fontSize: 13, color: '#1A1A1A', lineHeight: 1.5 }}>
              Baseado no seu padrão dos últimos 3 meses, você deve alcançar R$ 20.000 guardados até outubro. Isso é 2 meses antes do prazo original.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'gastos' && (
        <div className="scrollable" style={{ flex: 1, padding: 16 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 16 }}>Gastos vs. Limites</p>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6B6B6B' }}>Comparativo do mês atual</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {gastosData.map(g => {
              const acima = g.valor > g.limite;
              const pct = Math.min((g.valor / g.limite) * 100, 100);
              return (
                <div key={g.cat} style={{ background: '#FAFAFA', border: '1px solid #EFEFEF', borderRadius: 12, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{g.icon}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{g.cat}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: acima ? '#D32F2F' : '#00A651' }}>
                        R$ {g.valor.toLocaleString('pt-BR')}
                      </span>
                      <span style={{ fontSize: 12, color: '#9E9E9E' }}> / R$ {g.limite}</span>
                    </div>
                  </div>
                  <div style={{ background: '#E8E8E8', borderRadius: 6, height: 8 }}>
                    <div style={{
                      width: `${pct}%`,
                      background: acima ? '#D32F2F' : pct > 80 ? '#FF8C00' : '#00A651',
                      height: '100%', borderRadius: 6,
                    }} />
                  </div>
                  {acima && (
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#D32F2F' }}>
                      ⚠️ R$ {(g.valor - g.limite).toLocaleString('pt-BR')} acima do limite
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, background: '#FFF3F3', border: '1px solid #FFCDD2', borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#D32F2F', fontSize: 14 }}>⚠️ Alerta do Mentor</p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5 }}>
              Delivery e assinaturas estão R$ 230 acima do planejado. Esse padrão, se mantido, pode atrasar sua meta em 3 semanas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
