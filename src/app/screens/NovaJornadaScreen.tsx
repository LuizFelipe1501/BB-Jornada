"use client";
import { useState } from 'react';
import { useAppStore, Jornada, Insight } from '../store/appStore';
import { ArrowLeft, ChevronRight } from 'lucide-react';

const sonhos = [
  { label: 'Comprar carro', icon: '🚗', cor: '#1A4FBF' },
  { label: 'Comprar imóvel', icon: '🏠', cor: '#00257A' },
  { label: 'Viajar', icon: '✈️', cor: '#00897B' },
  { label: 'Casar', icon: '💍', cor: '#C2185B' },
  { label: 'Intercâmbio', icon: '🌍', cor: '#6A1B9A' },
  { label: 'Abrir empresa', icon: '🏢', cor: '#E65100' },
  { label: 'Pós-graduação', icon: '🎓', cor: '#283593' },
  { label: 'Reserva financeira', icon: '🏦', cor: '#2E7D32' },
  { label: 'Outro sonho', icon: '⭐', cor: '#0033A0' },
];

const aiInsightsGerados: Insight[] = [
  { id: 'g1', tipo: 'positivo', texto: 'Baseado no seu perfil, você tem capacidade de poupar R$ 600/mês para essa meta.', lido: false, data: 'agora', acao: 'Ver plano completo' },
  { id: 'g2', tipo: 'oportunidade', texto: 'Detectei R$ 280/mês em gastos que podem ser otimizados para acelerar sua jornada.', lido: false, data: 'agora', acao: 'Ver detalhes' },
  { id: 'g3', tipo: 'previsao', texto: 'Com disciplina, você pode alcançar esse objetivo até antes do prazo que definiu.', lido: false, data: 'agora' },
];

type Step = 'escolha' | 'valor' | 'prazo' | 'analise' | 'plano';

export default function NovaJornadaScreen() {
  const { setScreen, adicionarJornada } = useAppStore();
  const [step, setStep] = useState<Step>('escolha');
  const [sonhoSelecionado, setSonhoSelecionado] = useState<typeof sonhos[0] | null>(null);
  const [valor, setValor] = useState('');
  const [prazo, setPrazo] = useState('24');
  const [analisando, setAnalisando] = useState(false);
  const [aiText, setAiText] = useState('');

  const handleSonho = (s: typeof sonhos[0]) => {
    setSonhoSelecionado(s);
    setStep('valor');
  };

  const handleValor = () => {
    if (!valor || isNaN(Number(valor.replace(/\D/g, '')))) return;
    setStep('prazo');
  };

  const handlePrazo = () => {
    setStep('analise');
    setAnalisando(true);

    const messages = [
      'Analisando seu histórico financeiro...',
      'Calculando sua capacidade de poupança...',
      'Identificando oportunidades de economia...',
      'Criando sua jornada personalizada...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setAiText(messages[i]);
        i++;
      } else {
        clearInterval(interval);
        setAnalisando(false);
        setStep('plano');
      }
    }, 900);
  };

  const handleCriarJornada = () => {
    const valorNum = Number(valor.replace(/\D/g, ''));
    const prazoNum = Number(prazo);
    const novaJornada: Jornada = {
      id: Date.now().toString(),
      sonho: sonhoSelecionado?.label || 'Meu sonho',
      icon: sonhoSelecionado?.icon || '⭐',
      valor: valorNum,
      prazo: prazoNum,
      acumulado: 0,
      capitulo: 1,
      score: 50,
      criada: new Date().toISOString(),
      descricao: '',
      cor: sonhoSelecionado?.cor || '#0033A0',
      insights: aiInsightsGerados,
    };
    adicionarJornada(novaJornada);
    setScreen('jornada');
  };

  const valorNum = Number(valor.replace(/\D/g, ''));
  const prazoNum = Number(prazo) || 12;
  const porMes = valorNum && prazoNum ? Math.round(valorNum / prazoNum) : 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header interno */}
      <div style={{ background: '#0033A0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => step === 'escolha' ? setScreen('jornada') : setStep(step === 'valor' ? 'escolha' : step === 'prazo' ? 'valor' : 'escolha')}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}>
          <ArrowLeft size={20} />
        </button>
        <span style={{ color: 'white', fontWeight: 700, fontSize: 17 }}>Nova Jornada</span>

        {/* Steps indicator */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {(['escolha', 'valor', 'prazo', 'plano'] as Step[]).map((s, i) => {
            const steps: Step[] = ['escolha', 'valor', 'prazo', 'plano'];
            const current = steps.indexOf(step);
            const thisIdx = steps.indexOf(s);
            return (
              <div key={s} style={{
                width: 8, height: 8, borderRadius: 4,
                background: thisIdx <= current ? '#FFCC00' : 'rgba(255,255,255,0.3)',
              }} />
            );
          })}
        </div>
      </div>

      <div className="scrollable" style={{ flex: 1, padding: '20px 16px 24px' }}>
        {step === 'escolha' && (
          <div className="fade-in-up">
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0033A0' }}>
                Qual é o seu sonho?
              </h2>
              <p style={{ margin: 0, color: '#6B6B6B', fontSize: 14 }}>
                O BB Mentor vai criar uma jornada financeira personalizada pra você.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {sonhos.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSonho(s)}
                  style={{
                    background: 'white',
                    border: '2px solid #E8E8E8',
                    borderRadius: 14,
                    padding: '18px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: 32 }}>{s.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', textAlign: 'center' }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'valor' && (
          <div className="fade-in-up">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 48 }}>{sonhoSelecionado?.icon}</span>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#0033A0' }}>
                  {sonhoSelecionado?.label}
                </h2>
                <p style={{ margin: 0, color: '#6B6B6B', fontSize: 13 }}>Qual é o valor que você precisa?</p>
              </div>
            </div>

            <div style={{ background: '#F0F4FF', borderRadius: 14, padding: '20px 16px', marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: '#6B6B6B', fontWeight: 600 }}>VALOR TOTAL</label>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: '#0033A0' }}>R$</span>
                <input
                  type="number"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: 32,
                    fontWeight: 800,
                    color: '#0033A0',
                    width: '100%',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {[10000, 20000, 35000, 50000].map(v => (
                <button key={v} onClick={() => setValor(v.toString())} style={{
                  background: valor === v.toString() ? '#EEF2FF' : '#F5F5F5',
                  border: `1px solid ${valor === v.toString() ? '#0033A0' : '#E8E8E8'}`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontWeight: 600, color: '#1A1A1A' }}>R$ {v.toLocaleString('pt-BR')}</span>
                  {valor === v.toString() && <span style={{ color: '#0033A0' }}>✓</span>}
                </button>
              ))}
            </div>

            <button className="bb-btn-primary" onClick={handleValor} disabled={!valor}>
              Continuar →
            </button>
          </div>
        )}

        {step === 'prazo' && (
          <div className="fade-in-up">
            <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0033A0' }}>Em quanto tempo?</h2>
            <p style={{ margin: '0 0 24px', color: '#6B6B6B', fontSize: 14 }}>
              Escolha o prazo ideal para sua jornada.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { meses: '6', label: '6 meses · Meta de curto prazo' },
                { meses: '12', label: '12 meses · Meta anual' },
                { meses: '24', label: '24 meses · Meta de médio prazo' },
                { meses: '36', label: '36 meses · Meta de longo prazo' },
                { meses: '48', label: '48 meses · Meta estratégica' },
              ].map(({ meses, label }) => {
                const pm = valorNum ? Math.round(valorNum / Number(meses)) : 0;
                return (
                  <button
                    key={meses}
                    onClick={() => setPrazo(meses)}
                    style={{
                      background: prazo === meses ? '#EEF2FF' : 'white',
                      border: `2px solid ${prazo === meses ? '#0033A0' : '#E8E8E8'}`,
                      borderRadius: 12,
                      padding: '14px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: prazo === meses ? '#0033A0' : '#1A1A1A' }}>{label}</p>
                      {pm > 0 && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B6B6B' }}>≈ R$ {pm.toLocaleString('pt-BR')}/mês</p>}
                    </div>
                    {prazo === meses && <span style={{ color: '#0033A0', fontSize: 18 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            {porMes > 0 && (
              <div style={{ background: '#F0FFF4', border: '1px solid #00A651', borderRadius: 12, padding: 14, marginBottom: 20 }}>
                <p style={{ margin: 0, fontSize: 14, color: '#00A651', fontWeight: 600 }}>
                  💚 Guardando R$ {porMes.toLocaleString('pt-BR')}/mês, você alcança seu sonho em {prazo} meses.
                </p>
              </div>
            )}

            <button className="bb-btn-primary" onClick={handlePrazo}>
              Criar minha jornada →
            </button>
          </div>
        )}

        {step === 'analise' && (
          <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 300, gap: 24 }}>
            <div style={{ width: 80, height: 80, borderRadius: 40, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
              🤖
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 18, color: '#0033A0' }}>BB Mentor analisando...</p>
              <p style={{ margin: 0, color: '#6B6B6B', fontSize: 14 }}>{aiText}</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[0, 1, 2].map(i => (
                <div key={i} className="typing-dot" style={{ width: 10, height: 10, borderRadius: 5, background: '#0033A0', animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {step === 'plano' && (
          <div className="fade-in-up">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>✨</div>
              <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#0033A0' }}>
                Jornada criada!
              </h2>
              <p style={{ margin: 0, color: '#6B6B6B', fontSize: 14 }}>
                Seu plano personalizado está pronto.
              </p>
            </div>

            {/* Resumo */}
            <div style={{ background: 'linear-gradient(135deg, #0033A0, #1A4FBF)', borderRadius: 16, padding: 18, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 36 }}>{sonhoSelecionado?.icon}</span>
                <div>
                  <p style={{ margin: 0, color: '#FFCC00', fontWeight: 700, fontSize: 13 }}>SEU SONHO</p>
                  <p style={{ margin: '2px 0 0', color: 'white', fontWeight: 800, fontSize: 18 }}>{sonhoSelecionado?.label}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Meta</p>
                  <p style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: 15 }}>R$ {valorNum.toLocaleString('pt-BR')}</p>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.2)', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Prazo</p>
                  <p style={{ margin: '4px 0 0', color: 'white', fontWeight: 700, fontSize: 15 }}>{prazoNum} meses</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>Por mês</p>
                  <p style={{ margin: '4px 0 0', color: '#FFCC00', fontWeight: 700, fontSize: 15 }}>R$ {porMes.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15 }}>🤖 Análise do BB Mentor</p>
            {aiInsightsGerados.map(ins => (
              <div key={ins.id} style={{
                background: ins.tipo === 'positivo' ? '#F0FFF4' : ins.tipo === 'oportunidade' ? '#F0F4FF' : '#FDF4FF',
                border: `1px solid ${ins.tipo === 'positivo' ? '#00A651' : ins.tipo === 'oportunidade' ? '#0033A0' : '#9C27B0'}`,
                borderRadius: 12,
                padding: '12px 14px',
                marginBottom: 10,
              }}>
                <p style={{ margin: 0, fontSize: 13, color: '#1A1A1A', lineHeight: 1.5 }}>
                  {ins.tipo === 'positivo' ? '✅' : ins.tipo === 'oportunidade' ? '💡' : '🔮'} {ins.texto}
                </p>
              </div>
            ))}

            <button className="bb-btn-primary" style={{ marginTop: 16 }} onClick={handleCriarJornada}>
              🚀 Iniciar minha jornada
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
