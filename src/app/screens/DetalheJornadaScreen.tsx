"use client";
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import { ArrowLeft, Send, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const quickPrompts = [
  'Estou indo bem?',
  'Como acelerar minha meta?',
  'Onde posso economizar?',
  'Qual meu próximo passo?',
];

export default function DetalheJornadaScreen() {
  const { jornadaAtiva, setScreen, activeDetalheTab, setActiveDetalheTab } = useAppStore();
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string; streaming?: boolean; error?: boolean }[]>([
    {
      role: 'ai',
      text: `Olá! Sou o BB Mentor, seu guia financeiro pessoal com IA. Estou acompanhando sua jornada "${jornadaAtiva?.sonho}" desde o início. O que você quer saber sobre sua trilha de acúmulo?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (isLoading || !text.trim() || !jornadaAtiva) return;

    const jInfo = jornadaAtiva;
    const userMsg = { role: 'user' as const, text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Adiciona placeholder da IA com streaming
    setMessages(prev => [...prev, { role: 'ai' as const, text: '', streaming: true }]);

    try {
      const historyForApi = updatedMessages.slice(1).map(m => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyForApi,
          currentMessage: text,
          jornada: {
            sonho: jInfo.sonho,
            valor: jInfo.valor,
            prazo: jInfo.prazo,
            acumulado: jInfo.acumulado,
            capitulo: jInfo.capitulo,
            score: jInfo.score,
            meta_livre: jInfo.meta_livre,
          },
          user: {
            nome: useAppStore.getState().nome,
            rendaMensal: useAppStore.getState().rendaMensal,
            gastosMensais: useAppStore.getState().gastosMensais,
          },
          transacoes: useAppStore.getState().transacoes
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Erro na API');
      }

      if (!response.body) throw new Error('Sem body na resposta');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        // Atualiza a última mensagem (placeholder) com o texto acumulado
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'ai', text: accumulated, streaming: true };
          return updated;
        });
      }

      // Finaliza streaming
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'ai', text: accumulated, streaming: false };
        return updated;
      });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'ai',
          text: msg.includes('GEMINI_API_KEY')
            ? '⚙️ Configure a variável GEMINI_API_KEY no .env.local para ativar o BB Mentor com IA real.'
            : `Ocorreu um erro ao conectar com o BB Mentor. Tente novamente em instantes.`,
          error: true,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const jornadaInfo = jornadaAtiva;
  if (!jornadaInfo) return null;

  const isLivre = jornadaInfo.meta_livre;
  
  // Cálculo de marcos para a Meta Livre
  const milestones = [500, 1500, 5000, 10000, 20000, 50000];
  let nextMilestone = milestones[0];
  let prevMilestone = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (jornadaInfo.acumulado < milestones[i]) {
      nextMilestone = milestones[i];
      prevMilestone = i > 0 ? milestones[i-1] : 0;
      break;
    }
    if (i === milestones.length - 1) {
      nextMilestone = milestones[i];
      prevMilestone = milestones[i-1];
    }
  }

  const range = nextMilestone - prevMilestone;
  const progressInRange = Math.max(0, jornadaInfo.acumulado - prevMilestone);
  const porcentagemLivre = Math.min(100, Math.round((progressInRange / range) * 100));

  const porcentagem = isLivre 
    ? porcentagemLivre 
    : Math.round((jornadaInfo.acumulado / (jornadaInfo.valor || 1)) * 100);

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
            <p style={{ margin: 0, color: '#FFCC00', fontSize: 12, fontWeight: 700 }}>
              {isLivre ? 'META LIVRE ATIVA' : 'JORNADA ATIVA'}
            </p>
            <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 16 }}>{jornadaInfo.icon} {jornadaInfo.sonho}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 18 }}>{porcentagem}%</p>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
              {isLivre ? `marco N${milestones.indexOf(nextMilestone) + 1}` : 'concluído'}
            </p>
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 6, height: 6, marginBottom: 12 }}>
          <div style={{ width: `${porcentagem}%`, background: '#FFCC00', height: '100%', borderRadius: 6 }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex' }}>
          {[
            { id: 'mentor', label: '🤖 Mentor IA' },
            { id: 'grafico', label: '📊 Evolução' },
            { id: 'gastos', label: '💸 Gastos' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveDetalheTab(t.id as any)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                color: activeDetalheTab === t.id ? '#FFCC00' : 'rgba(255,255,255,0.65)',
                fontWeight: activeDetalheTab === t.id ? 700 : 500,
                fontSize: 13,
                padding: '8px 4px',
                cursor: 'pointer',
                borderBottom: activeDetalheTab === t.id ? '2px solid #FFCC00' : '2px solid transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab: Mentor */}
      {activeDetalheTab === 'mentor' && (
        <>
          <div className="scrollable" style={{ flex: 1, padding: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 12,
              }}>
                {msg.role === 'ai' && (
                  <div style={{
                    width: 32, height: 32, borderRadius: 16,
                    background: '#FFCC00',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
                  }}>
                    {msg.error ? <AlertCircle size={16} color="#D32F2F" /> : '🤖'}
                  </div>
                )}
                <div style={{
                  maxWidth: '78%',
                  background: msg.role === 'user'
                    ? '#0033A0'
                    : msg.error ? '#FFF3F3' : '#F0F4FF',
                  color: msg.role === 'user' ? 'white' : msg.error ? '#1A1A1A' : '#1A1A1A',
                  borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  padding: '10px 14px',
                  fontSize: 14,
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap',
                  border: msg.error ? '1px solid #FFCDD2' : 'none',
                }}>
                  {msg.text || (msg.streaming && (
                    <span style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '2px 0' }}>
                      {[0, 1, 2].map(j => (
                        <span key={j} className="typing-dot" style={{
                          display: 'inline-block', width: 7, height: 7,
                          borderRadius: '50%', background: '#9E9E9E',
                          animationDelay: `${j * 0.2}s`,
                        }} />
                      ))}
                    </span>
                  ))}
                  {msg.streaming && msg.text && (
                    <span style={{
                      display: 'inline-block', width: 2, height: 14,
                      background: '#0033A0', marginLeft: 2,
                      animation: 'pulse-dot 0.8s ease infinite',
                      verticalAlign: 'middle',
                    }} />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
            {quickPrompts.map(p => (
              <button
                key={p}
                onClick={() => !isLoading && sendMessage(p)}
                disabled={isLoading}
                style={{
                  flexShrink: 0,
                  background: '#EEF2FF',
                  border: '1px solid #C5D0F0',
                  borderRadius: 20,
                  padding: '6px 12px',
                  fontSize: 12,
                  color: isLoading ? '#BDBDBD' : '#0033A0',
                  fontWeight: 600,
                  cursor: isLoading ? 'default' : 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.2s',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !isLoading && input.trim() && sendMessage(input.trim())}
              placeholder={isLoading ? 'BB Mentor respondendo...' : 'Pergunte ao BB Mentor...'}
              disabled={isLoading}
              style={{
                flex: 1,
                border: '1.5px solid #E0E0E0',
                borderRadius: 24,
                padding: '10px 16px',
                fontSize: 14,
                outline: 'none',
                fontFamily: 'inherit',
                background: isLoading ? '#FAFAFA' : 'white',
                color: '#1A1A1A',
              }}
            />
            <button
              onClick={() => input.trim() && !isLoading && sendMessage(input.trim())}
              disabled={!input.trim() || isLoading}
              style={{
                width: 44, height: 44, borderRadius: 22,
                background: input.trim() && !isLoading ? '#0033A0' : '#E0E0E0',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </>
      )}

      {/* Tab: Gráfico */}
      {activeDetalheTab === 'grafico' && (
        <div className="scrollable" style={{ flex: 1, padding: 16 }}>
          <p style={{ margin: '0 0 16px', fontWeight: 700, fontSize: 16 }}>Evolução mensal de poupança</p>
          <div style={{ background: '#F0F4FF', borderRadius: 14, padding: '16px 12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
              {evoluçãoMeses.map(m => {
                const height = (m.valor / maxVal) * 130;
                const isBest = m.valor === maxVal;
                return (
                  <div key={m.mes} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 10, color: '#0033A0', fontWeight: 700 }}>
                      R${m.valor}
                    </span>
                    <div style={{
                      width: '100%', height,
                      background: isBest ? '#FFCC00' : '#0033A0',
                      borderRadius: '6px 6px 0 0',
                      position: 'relative',
                    }}>
                      {isBest && (
                        <span style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 12 }}>⭐</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: '#6B6B6B' }}>{m.mes}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
            <div style={{ background: '#F0FFF4', borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <TrendingUp size={16} color="#00A651" />
                <span style={{ fontSize: 12, color: '#6B6B6B' }}>Melhor mês</span>
              </div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18, color: '#00A651' }}>R$ 820</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B6B6B' }}>Maio/2025</p>
            </div>
            <div style={{ background: '#FFF8E7', borderRadius: 12, padding: 14 }}>
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
              {isLivre 
                ? `Baseado nas suas movimentações, você está acumulando com consistência ideal. O seu score relacional aponta que você está construindo hábitos que aceleram a segurança financeira de longo prazo.`
                : `Baseado no seu padrão dos últimos 3 meses, você deve alcançar R$ 20.000 guardados até outubro — 2 meses antes do prazo original.`
              }
            </p>
          </div>
        </div>
      )}

      {/* Tab: Gastos */}
      {activeDetalheTab === 'gastos' && (
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
                      transition: 'width 0.8s ease',
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
              Delivery e assinaturas estão R$ 230 acima do planejado. Esse padrão, se mantido, pode atrasar seu acúmulo financeiro no curto prazo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
