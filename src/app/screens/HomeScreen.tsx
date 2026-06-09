"use client";
import { useAppStore } from '../store/appStore';
import { ChevronRight, Zap } from 'lucide-react';

const quickActions = [
  { label: 'Pix', icon: '⚡' },
  { label: 'Pagar', icon: '📄' },
  { label: 'Cartões', icon: '💳' },
  { label: 'Invest.', icon: '📈' },
  { label: 'Crédito', icon: '🏦' },
];

export default function HomeScreen() {
  const { saldoVisible, saldo, jornadaAtiva, setTab, setScreen } = useAppStore();

  const porcentagem = jornadaAtiva
    ? Math.round((jornadaAtiva.acumulado / jornadaAtiva.valor) * 100)
    : 0;

  return (
    <div className="scrollable" style={{ flex: 1, padding: '0 0 8px' }}>
      {/* Saldo */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="bb-card" style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Saldo conta</p>
            <p style={{ margin: '4px 0 6px', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>
              {saldoVisible ? `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ •••'}
            </p>
            <button style={{ background: 'none', border: 'none', color: '#0033A0', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver extrato <ChevronRight size={14} />
            </button>
          </div>
          <div className="bb-card" style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Agendamentos</p>
            <p style={{ margin: '4px 0 6px', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>R$ 0,00</p>
            <button style={{ background: 'none', border: 'none', color: '#0033A0', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver lançamentos <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div style={{ padding: '20px 16px 0', overflowX: 'auto', display: 'flex', gap: 20 }}>
        {quickActions.map((a) => (
          <div key={a.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, cursor: 'pointer',
            }}>
              {a.icon}
            </div>
            <span style={{ fontSize: 11, color: '#1A1A1A', fontWeight: 500 }}>{a.label}</span>
          </div>
        ))}
      </div>

      {/* Card Jornada Ativa */}
      {jornadaAtiva && (
        <div style={{ padding: '20px 16px 0' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0033A0 0%, #1A4FBF 100%)',
              borderRadius: 16,
              padding: 16,
              cursor: 'pointer',
            }}
            onClick={() => { setTab('jornada'); setScreen('jornada'); }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#FFCC00" fill="#FFCC00" />
                  <span style={{ color: '#FFCC00', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>JORNADA ATIVA</span>
                </div>
                <p style={{ margin: '8px 0 4px', color: 'white', fontWeight: 700, fontSize: 18 }}>
                  {jornadaAtiva.icon} {jornadaAtiva.sonho}
                </p>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>
                  Capítulo {jornadaAtiva.capitulo} de 5
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 22 }}>{porcentagem}%</p>
                <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>concluído</p>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.2)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
              <div style={{ width: `${porcentagem}%`, background: '#FFCC00', height: '100%', borderRadius: 8, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                R$ {jornadaAtiva.acumulado.toLocaleString('pt-BR')} guardados
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>
                Meta: R$ {jornadaAtiva.valor.toLocaleString('pt-BR')}
              </span>
            </div>

            {/* AI Insight preview */}
            <div style={{
              marginTop: 12, background: 'rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '10px 12px',
              borderLeft: '3px solid #FFCC00',
            }}>
              <p style={{ margin: 0, color: 'white', fontSize: 13 }}>
                💡 &ldquo;Você está 8% à frente da meta. Se manter o ritmo, chegará 2 meses antes.&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Fale com o BB */}
      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Fale com o BB</p>
          <button style={{ background: 'none', border: 'none', color: '#0033A0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Ver mais</button>
        </div>
        <div className="bb-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 22 }}>💬</span>
          <span style={{ flex: 1, fontSize: 14 }}>Ser atendido pelo WhatsApp</span>
          <ChevronRight size={18} color="#9E9E9E" />
        </div>
      </div>

      {/* Avaliação */}
      <div style={{ margin: '20px 16px 0', border: '1px solid #E8E8E8', borderRadius: 12, padding: 16, textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px', fontWeight: 700, fontSize: 15 }}>Curtindo o App BB?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <span key={s} style={{ fontSize: 28, cursor: 'pointer', color: '#E0E0E0' }}>★</span>
          ))}
        </div>
      </div>
    </div>
  );
}
