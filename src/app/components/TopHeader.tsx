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
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
      <rect width="32" height="32" rx="6" fill="#FFCC00" />
      <svg x="5.5" y="5.5" viewBox="327 464 18.5 17" width="21" height="21">
        <path
          d="m 329.75202,470.27969 2.59766,1.7334 3.12011,-2.08008 -1.29882,-0.86915 1.68945,-1.12304 3.6377,2.42675 -5.97657,3.98438 1.29883,0.86914 7.41211,-4.9414 -6.24024,-4.16017 z m 12.48047,4.16015 -2.60253,-1.73339 -3.12013,2.08007 1.29883,0.86425 -1.68946,1.12794 -3.63768,-2.42676 5.97656,-3.98438 -1.29884,-0.86913 -7.40722,4.9414 6.24023,4.16016 z m 0,-6.58692 -1.30371,0.86915 -1.29882,-0.86915 2.60253,-1.7334 z m -12.48047,9.01368 1.29882,-0.86914 1.29884,0.86914 -2.59766,1.7334 z"
          fill="#0033A0"
          fillRule="evenodd"
        />
      </svg>
    </svg>
  );
}
