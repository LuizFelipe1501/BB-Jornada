"use client";
import { useAppStore } from '../store/appStore';
import { ChevronRight, Shield, Bell, HelpCircle, FileText, LogOut } from 'lucide-react';

export default function PerfilScreen() {
  const { nome, jornadaAtiva, rendaMensal, gastosMensais, resetUserSession } = useAppStore();

  const score = jornadaAtiva?.score || 0;
  const capacidadePoupanca = rendaMensal - gastosMensais;

  const menuItems = [
    { icon: <Shield size={18} />, label: 'Dados pessoais', sub: 'CPF, endereço, contato' },
    { icon: <Bell size={18} />, label: 'Notificações', sub: 'Alertas e preferências' },
    { icon: <FileText size={18} />, label: 'Histórico de jornadas', sub: '1 jornada concluída' },
    { icon: <HelpCircle size={18} />, label: 'Ajuda e suporte', sub: 'Central de ajuda' },
    { icon: <LogOut size={18} />, label: 'Sair', sub: 'Reiniciar sessão do MVP', danger: true },
  ];

  const handleItemClick = (label: string) => {
    if (label === 'Sair') {
      resetUserSession();
    }
  };

  return (
    <div className="scrollable" style={{ flex: 1 }}>
      {/* Hero perfil */}
      <div style={{ background: 'linear-gradient(135deg, #0033A0, #1A4FBF)', padding: '24px 16px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 32,
            background: '#FFCC00',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: '#0033A0',
          }}>
            {nome ? nome.charAt(0) : 'J'}
          </div>
          <div>
            <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: 20 }}>{nome || 'Jurado'}</p>
            <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
              Cliente BB · Conta Corrente
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Score Relacional */}
        <div style={{ background: '#F0F4FF', borderRadius: 16, padding: '16px', marginBottom: 20, marginTop: -20, border: '1px solid #C5D0F0' }}>
          <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15 }}>⭐ Score Relacional BB</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', width: 72, height: 72 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#E8E8E8" strokeWidth="8" />
                <circle cx="36" cy="36" r="28" fill="none" stroke="#FFCC00" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / 100)}`}
                  transform="rotate(-90 36 36)" />
                <text x="36" y="36" textAnchor="middle" dominantBaseline="middle" fill="#0033A0" fontWeight="800" fontSize="16">{score}</text>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 16, color: score >= 70 ? '#00A651' : score >= 40 ? '#FF8C00' : '#D32F2F' }}>
                {score >= 70 ? 'Excelente' : score >= 40 ? 'Em desenvolvimento' : 'Precisa melhorar'}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#6B6B6B', lineHeight: 1.4 }}>
                Você está no top 30% dos clientes BB com jornadas ativas.
              </p>
            </div>
          </div>
        </div>

        {/* Resumo financeiro */}
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15 }}>Resumo financeiro</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          <div style={{ background: '#F0FFF4', borderRadius: 12, padding: '14px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Renda mensal</p>
            <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#00A651' }}>
              R$ {rendaMensal.toLocaleString('pt-BR')}
            </p>
          </div>
          <div style={{ background: '#FFF8E7', borderRadius: 12, padding: '14px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Gastos mensais</p>
            <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 18, color: '#FF8C00' }}>
              R$ {gastosMensais.toLocaleString('pt-BR')}
            </p>
          </div>
          <div style={{ background: '#F0F4FF', borderRadius: 12, padding: '14px', gridColumn: 'span 2' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Capacidade de poupança</p>
            <p style={{ margin: '4px 0 0', fontWeight: 800, fontSize: 20, color: '#0033A0' }}>
              R$ {capacidadePoupanca.toLocaleString('pt-BR')}/mês
            </p>
          </div>
        </div>

        {/* Conquistas */}
        <p style={{ margin: '0 0 12px', fontWeight: 700, fontSize: 15 }}>🏆 Conquistas</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' }}>
          {[
            { icon: '🎯', label: 'Primeira meta', desbloqueada: true },
            { icon: '📅', label: '30 dias seguidos', desbloqueada: true },
            { icon: '💰', label: 'R$ 10k guardados', desbloqueada: true },
            { icon: '🚀', label: 'Meta antecipada', desbloqueada: false },
            { icon: '🏅', label: 'Score 90+', desbloqueada: false },
          ].map(c => (
            <div key={c.label} style={{
              flexShrink: 0,
              width: 72,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              opacity: c.desbloqueada ? 1 : 0.4,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 26,
                background: c.desbloqueada ? '#EEF2FF' : '#F5F5F5',
                border: `2px solid ${c.desbloqueada ? '#0033A0' : '#E0E0E0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {c.icon}
              </div>
              <span style={{ fontSize: 10, textAlign: 'center', color: '#6B6B6B', lineHeight: 1.3 }}>{c.label}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div style={{ border: '1px solid #EFEFEF', borderRadius: 14, overflow: 'hidden' }}>
          {menuItems.map((item, i) => (
            <div
              key={item.label}
              onClick={() => handleItemClick(item.label)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 16px',
                borderBottom: i < menuItems.length - 1 ? '1px solid #EFEFEF' : 'none',
                cursor: 'pointer',
                color: (item as any).danger ? '#D32F2F' : '#1A1A1A',
              }}
            >
              <div style={{ color: (item as any).danger ? '#D32F2F' : '#0033A0' }}>{item.icon}</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.label}</p>
                {item.sub && <p style={{ margin: 0, fontSize: 12, color: '#9E9E9E' }}>{item.sub}</p>}
              </div>
              {!(item as any).danger && <ChevronRight size={18} color="#BDBDBD" />}
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#BDBDBD', fontSize: 12, marginTop: 20 }}>
          BB Jornada v1.0.0 · Banco do Brasil S.A.
        </p>
      </div>
    </div>
  );
}
