"use client";
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

const tipoConfig = {
  positivo: { icon: '✅', bg: '#F0FFF4', border: '#00A651', label: 'Positivo', color: '#00A651' },
  alerta: { icon: '⚠️', bg: '#FFF8E7', border: '#FF8C00', label: 'Alerta', color: '#FF8C00' },
  oportunidade: { icon: '💡', bg: '#F0F4FF', border: '#0033A0', label: 'Oportunidade', color: '#0033A0' },
  previsao: { icon: '🔮', bg: '#FDF4FF', border: '#9C27B0', label: 'Previsão', color: '#9C27B0' },
};

export default function NotificacoesScreen() {
  const { notificacoes, marcarTodosInsightsLidos, marcarInsightLido } = useAppStore();

  useEffect(() => {
    marcarTodosInsightsLidos();
  }, [marcarTodosInsightsLidos]);

  const naoLidas = notificacoes.filter(n => !n.lido);
  const lidas = notificacoes.filter(n => n.lido);

  return (
    <div className="scrollable" style={{ flex: 1, padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: '#1A1A1A' }}>Insights do Mentor</h2>
        {naoLidas.length > 0 && (
          <span style={{ background: '#FFCC00', color: '#0033A0', borderRadius: 12, padding: '3px 10px', fontSize: 12, fontWeight: 700 }}>
            {naoLidas.length} novos
          </span>
        )}
      </div>

      {naoLidas.length > 0 && (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#6B6B6B', letterSpacing: 0.5 }}>NOVOS</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {naoLidas.map(ins => {
              const cfg = tipoConfig[ins.tipo];
              return (
                <div
                  key={ins.id}
                  onClick={() => marcarInsightLido(ins.id)}
                  style={{
                    background: cfg.bg,
                    border: `1.5px solid ${cfg.border}`,
                    borderRadius: 14,
                    padding: '14px 16px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 18 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: 0.5 }}>{cfg.label.toUpperCase()}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#9E9E9E' }}>{ins.data}</span>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: '#FFCC00', flexShrink: 0 }} />
                  </div>
                  <p style={{ margin: '0 0 10px', fontSize: 14, color: '#1A1A1A', lineHeight: 1.6 }}>{ins.texto}</p>
                  {ins.acao && (
                    <button style={{
                      background: cfg.border,
                      border: 'none',
                      borderRadius: 8,
                      padding: '8px 14px',
                      color: 'white',
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}>
                      {ins.acao} →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {lidas.length > 0 && (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#6B6B6B', letterSpacing: 0.5 }}>ANTERIORES</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lidas.map(ins => {
              const cfg = tipoConfig[ins.tipo];
              return (
                <div
                  key={ins.id}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid #EFEFEF',
                    borderRadius: 14,
                    padding: '12px 16px',
                    opacity: 0.8,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                    <span style={{ fontSize: 11, color: '#9E9E9E' }}>{cfg.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: '#BDBDBD' }}>{ins.data}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#6B6B6B', lineHeight: 1.5 }}>{ins.texto}</p>
                </div>
              );
            })}
          </div>
        </>
      )}

      {notificacoes.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <p style={{ fontWeight: 700, fontSize: 18, color: '#0033A0', margin: '0 0 8px' }}>Tudo em dia!</p>
          <p style={{ color: '#6B6B6B', fontSize: 14 }}>Quando o BB Mentor detectar algo importante, você verá aqui.</p>
        </div>
      )}
    </div>
  );
}
