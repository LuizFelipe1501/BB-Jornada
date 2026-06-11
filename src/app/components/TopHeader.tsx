"use client";
import { useAppStore } from '../store/appStore';
import { Eye, EyeOff, MessageSquare, LogOut } from 'lucide-react';

interface Props {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export default function TopHeader({ title, showBack, onBack }: Props) {
  const { nome, saldoVisible, toggleSaldo, screen, resetUserSession } = useAppStore();
  const isHome = screen === 'home';

  return (
    <header
      style={{
        background: '#0033A0',
        padding: '12px 16px 16px',
        flexShrink: 0,
        paddingTop: 'calc(12px + env(safe-area-inset-top))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {showBack ? (
            <button
              onClick={onBack}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 4 }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <BBLogo />
          )}
          <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
            {title || `Olá, ${nome}`}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {isHome && (
            <button
              onClick={toggleSaldo}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              {saldoVisible ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          )}
          <button style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
            <MessageSquare size={20} />
          </button>
          <button 
            onClick={resetUserSession}
            style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
            title="Reiniciar sessão do MVP"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

function BBLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#FFCC00" />
      <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="#0033A0" fontWeight="900" fontSize="14">BB</text>
    </svg>
  );
}
