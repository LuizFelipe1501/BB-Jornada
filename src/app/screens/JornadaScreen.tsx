"use client";
import { useAppStore } from '../store/appStore';
import { Plus, ChevronRight, Star, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { useState } from 'react';
import TrilhaModal from '../components/TrilhaModal';

const capituloLabels = [
  'Conhecendo sua realidade',
  'Eliminando desperdícios',
  'Construindo reservas',
  'Acelerando o crescimento',
  'Conquistando o objetivo',
];

const capituloIcons = ['🗺️', '✂️', '🏛️', '🚀', '🏆'];

function ScoreRing({ score }: { score: number }) {
  const r = 44;
  const circunferencia = 2 * Math.PI * r;
  const offset = circunferencia - (score / 100) * circunferencia;
  
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <circle cx="55" cy="55" r={r} fill="none" stroke="#E8E8E8" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke="#FFCC00"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circunferencia}
        strokeDashoffset={offset}
        transform="rotate(-90 55 55)"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text x="55" y="50" textAnchor="middle" fill="#0033A0" fontWeight="800" fontSize="22">{score}</text>
      <text x="55" y="66" textAnchor="middle" fill="#6B6B6B" fontSize="11">Score</text>
    </svg>
  );
}

function ScoreDimension({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#6B6B6B' }}>{label}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#0033A0' }}>{value}%</span>
        </div>
        <div style={{ background: '#E8E8E8', borderRadius: 4, height: 6 }}>
          <div style={{ width: `${value}%`, background: value >= 70 ? '#00A651' : value >= 40 ? '#FF8C00' : '#D32F2F', height: '100%', borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}

export default function JornadaScreen() {
  const { jornadaAtiva, setScreen, setJornadaDetalhe } = useAppStore();
  const [showScore, setShowScore] = useState(false);
  const [activeChapterTrilha, setActiveChapterTrilha] = useState<number | null>(null);

  if (!jornadaAtiva) {
    return <EmptyJornada />;
  }

  const isLivre = jornadaAtiva.meta_livre;
  
  // Cálculo de marcos para a Meta Livre
  const milestones = [500, 1500, 5000, 10000, 20000, 50000];
  let nextMilestone = milestones[0];
  let prevMilestone = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (jornadaAtiva.acumulado < milestones[i]) {
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
  const progressInRange = Math.max(0, jornadaAtiva.acumulado - prevMilestone);
  const porcentagemLivre = Math.min(100, Math.round((progressInRange / range) * 100));

  const porcentagem = isLivre ? porcentagemLivre : Math.round((jornadaAtiva.acumulado / (jornadaAtiva.valor || 1)) * 100);
  const mesesRestantes = isLivre ? null : (jornadaAtiva.prazo || 12) - Math.floor((jornadaAtiva.acumulado / (jornadaAtiva.valor || 1)) * (jornadaAtiva.prazo || 12));
  const economiaTotal = jornadaAtiva.acumulado;
  const faltam = isLivre ? null : (jornadaAtiva.valor || 0) - jornadaAtiva.acumulado;
  const por_mes = isLivre ? null : Math.round((faltam || 0) / (mesesRestantes || 1));

  return (
    <div className="scrollable" style={{ flex: 1 }}>
      {/* Hero Jornada */}
      <div
        style={{
          background: 'linear-gradient(160deg, #0033A0 0%, #1A4FBF 60%, #2860D0 100%)',
          padding: '20px 16px 24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Zap size={14} color="#FFCC00" fill="#FFCC00" />
              <span style={{ color: '#FFCC00', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                {isLivre ? 'META LIVRE ATIVA' : 'JORNADA ATIVA'}
              </span>
            </div>
            <h2 style={{ margin: 0, color: 'white', fontSize: 24, fontWeight: 800 }}>
              {jornadaAtiva.icon} {jornadaAtiva.sonho}
            </h2>
            <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
              {capituloIcons[jornadaAtiva.capitulo - 1]} Capítulo {jornadaAtiva.capitulo}: {capituloLabels[jornadaAtiva.capitulo - 1]}
            </p>
          </div>
          <div onClick={() => setShowScore(!showScore)} style={{ cursor: 'pointer' }}>
            <ScoreRing score={jornadaAtiva.score} />
          </div>
        </div>

        {/* Progresso */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
              R$ {jornadaAtiva.acumulado.toLocaleString('pt-BR')} guardados
              {isLivre && ` · Nível ${milestones.indexOf(nextMilestone) + 1}`}
            </span>
            <span style={{ color: '#FFCC00', fontWeight: 800, fontSize: 16 }}>{porcentagem}%</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, height: 10 }}>
            <div style={{ width: `${porcentagem}%`, background: '#FFCC00', height: '100%', borderRadius: 10 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            {isLivre ? (
              <>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Base: R$ {prevMilestone.toLocaleString('pt-BR')}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Alvo: R$ {nextMilestone.toLocaleString('pt-BR')}</span>
              </>
            ) : (
              <>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Meta: R$ {jornadaAtiva.valor?.toLocaleString('pt-BR')}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{mesesRestantes} meses restantes</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px 24px' }}>
        {/* Score Relacional expandido */}
        {showScore && (
          <div className="bb-card fade-in-up" style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Star size={16} color="#FFCC00" fill="#FFCC00" />
              <span style={{ fontWeight: 700, fontSize: 15 }}>Score Relacional BB</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ScoreDimension label="Disciplina" value={85} icon="🎯" />
              <ScoreDimension label="Consistência" value={72} icon="📅" />
              <ScoreDimension label="Evolução" value={60} icon="📈" />
              <ScoreDimension label="Saúde Financeira" value={68} icon="💚" />
              <ScoreDimension label="Proximidade do Objetivo" value={porcentagem} icon="🏁" />
            </div>
          </div>
        )}

        {/* Números rápidos */}
        {isLivre ? (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div style={{ flex: 1, background: '#F0FFF4', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Total Guardado</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#00A651' }}>
                R$ {economiaTotal.toLocaleString('pt-BR')}
              </p>
            </div>
            <div style={{ flex: 1, background: '#FFF8E7', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Próximo Marco</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#FF8C00' }}>
                R$ {nextMilestone.toLocaleString('pt-BR')}
              </p>
            </div>
            <div style={{ flex: 1, background: '#F0F4FF', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Falta p/ Marco</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#0033A0' }}>
                R$ {Math.max(0, nextMilestone - economiaTotal).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <div style={{ flex: 1, background: '#F0FFF4', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Guardado</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#00A651' }}>
                R$ {economiaTotal.toLocaleString('pt-BR')}
              </p>
            </div>
            <div style={{ flex: 1, background: '#FFF8E7', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Por mês</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#FF8C00' }}>
                R$ {(por_mes || 0).toLocaleString('pt-BR')}
              </p>
            </div>
            <div style={{ flex: 1, background: '#F0F4FF', borderRadius: 12, padding: '12px 14px' }}>
              <p style={{ margin: 0, fontSize: 11, color: '#6B6B6B' }}>Faltam</p>
              <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#0033A0' }}>
                R$ {(faltam || 0).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        )}

        {/* AI Mentor card */}
        <div
          style={{
            marginTop: 16,
            background: 'linear-gradient(135deg, #0033A0, #1A4FBF)',
            borderRadius: 16,
            padding: 16,
            cursor: 'pointer',
          }}
          onClick={() => { setJornadaDetalhe(jornadaAtiva); setScreen('detalhe-jornada'); }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18,
              background: '#FFCC00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🤖</div>
            <div>
              <p style={{ margin: 0, color: '#FFCC00', fontWeight: 700, fontSize: 12 }}>BB MENTOR</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>IA Relacional · Online agora</p>
            </div>
          </div>
          <p style={{ margin: '0 0 12px', color: 'white', fontSize: 14, lineHeight: 1.5 }}>
            {isLivre ? (
              <>
                &ldquo;Você está poupando livremente de forma exemplar! Seu score relacional de <strong>{jornadaAtiva.score} pontos</strong> mostra excelente disciplina. Que tal conversarmos sobre como rentabilizar seu saldo acumulado?&rdquo;
              </>
            ) : (
              <>
                &ldquo;Você está indo muito bem, {' '}
                <strong>8% acima da meta</strong>. Se continuar assim, pode conquistar seu objetivo{' '}
                <strong>2 meses antes</strong> do prazo. Vamos acelerar?&rdquo;
              </>
            )}
          </p>
          <button style={{
            background: '#FFCC00',
            border: 'none',
            borderRadius: 8,
            padding: '10px 16px',
            fontWeight: 700,
            fontSize: 14,
            cursor: 'pointer',
            color: '#0033A0',
          }}>
            Conversar com o Mentor →
          </button>
        </div>

        {/* Capítulos */}
        <div style={{ marginTop: 20 }}>
          <p style={{ margin: '0 0 14px', fontWeight: 700, fontSize: 16 }}>Sua Jornada do Herói (Toque para Acessar a Trilha) 🗺️</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {capituloLabels.map((cap, i) => {
              const num = i + 1;
              const isDone = num < jornadaAtiva.capitulo;
              const isActive = num === jornadaAtiva.capitulo;
              const isLocked = num > jornadaAtiva.capitulo;
              return (
                <div
                  key={num}
                  className={isDone ? 'chapter-done' : isActive ? 'chapter-active' : 'chapter-locked'}
                  onClick={() => {
                    if (!isLocked) {
                      setActiveChapterTrilha(num);
                    }
                  }}
                  style={{
                    background: isActive ? '#F0F4FF' : 'white',
                    border: '1px solid',
                    borderColor: isActive ? '#0033A0' : isDone ? '#00A651' : '#E0E0E0',
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: isLocked ? 'default' : 'pointer',
                    transition: 'transform 0.15s ease-in-out',
                    transform: isActive ? 'scale(1.01)' : 'none',
                  }}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 20,
                    background: isDone ? '#00A651' : isActive ? '#0033A0' : '#E8E8E8',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, flexShrink: 0,
                    color: 'white',
                  }}>
                    {isDone ? '✓' : capituloIcons[i]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#9E9E9E' }}>
                      Capítulo {num} {isActive && '· Em andamento'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontWeight: 600, fontSize: 14, color: isLocked ? '#BDBDBD' : '#1A1A1A' }}>
                      {cap}
                    </p>
                  </div>
                  {!isLocked && (
                    <span style={{
                      fontSize: 11,
                      color: isActive ? '#0033A0' : '#00A651',
                      fontWeight: 700,
                      background: isActive ? '#EEF2FF' : '#E2FBE9',
                      padding: '2px 8px',
                      borderRadius: 8,
                      marginRight: 4,
                    }}>
                      {isActive ? 'Trilha' : 'Rever'}
                    </span>
                  )}
                  {(isDone || isActive) && <ChevronRight size={18} color="#9E9E9E" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <InsightsSection />

        {/* Nova jornada */}
        <button
          onClick={() => setScreen('nova-jornada')}
          style={{
            marginTop: 20,
            width: '100%',
            background: 'none',
            border: '2px dashed #0033A0',
            borderRadius: 12,
            padding: '14px',
            color: '#0033A0',
            fontWeight: 600,
            fontSize: 14,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Plus size={18} /> Criar nova jornada
        </button>
      </div>

      {/* Renderização da Trilha do Capítulo */}
      {activeChapterTrilha !== null && (
        <TrilhaModal
          capituloId={activeChapterTrilha}
          onClose={() => setActiveChapterTrilha(null)}
        />
      )}
    </div>
  );
}

function InsightsSection() {
  const { jornadaAtiva, setJornadaDetalhe, setScreen, setActiveDetalheTab, marcarInsightLido } = useAppStore();
  const insights = jornadaAtiva?.insights.slice(0, 3) || [];

  const tipoConfig = {
    positivo: { icon: '✅', bg: '#F0FFF4', border: '#00A651', label: 'Positivo' },
    alerta: { icon: '⚠️', bg: '#FFF8E7', border: '#FF8C00', label: 'Alerta' },
    oportunidade: { icon: '💡', bg: '#F0F4FF', border: '#0033A0', label: 'Oportunidade' },
    previsao: { icon: '🔮', bg: '#FDF4FF', border: '#9C27B0', label: 'Previsão' },
  };

  const handleInsightClick = (id: string, tipo: string) => {
    if (!jornadaAtiva) return;
    
    marcarInsightLido(id);
    
    if (tipo === 'alerta') {
      setActiveDetalheTab('gastos');
    } else if (tipo === 'previsao') {
      setActiveDetalheTab('grafico');
    } else {
      setActiveDetalheTab('mentor');
    }
    
    setJornadaDetalhe(jornadaAtiva);
    setScreen('detalhe-jornada');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Insights do Mentor</p>
        <span style={{ background: '#D32F2F', color: 'white', borderRadius: 10, fontSize: 11, fontWeight: 700, padding: '2px 8px' }}>
          {insights.filter(i => !i.lido).length} novos
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {insights.map(ins => {
          const cfg = tipoConfig[ins.tipo];
          return (
            <div
              key={ins.id}
              onClick={() => handleInsightClick(ins.id, ins.tipo)}
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 12,
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: cfg.border }}>{cfg.label}</span>
                {!ins.lido && (
                  <span style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: 4, background: '#D32F2F' }} />
                )}
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 13, color: '#1A1A1A', lineHeight: 1.5 }}>{ins.texto}</p>
              {ins.acao && (
                <span style={{ color: cfg.border, fontWeight: 700, fontSize: 13, display: 'inline-block' }}>
                  {ins.acao} →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyJornada() {
  const { setScreen } = useAppStore();
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎯</div>
      <h2 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800, color: '#0033A0' }}>Qual é o seu sonho?</h2>
      <p style={{ margin: '0 0 24px', color: '#6B6B6B', lineHeight: 1.6 }}>
        O BB Mentor vai transformar seu objetivo em uma jornada financeira personalizada com IA.
      </p>
      <button className="bb-btn-primary" onClick={() => setScreen('nova-jornada')}>
        🚀 Iniciar minha jornada
      </button>
    </div>
  );
}
