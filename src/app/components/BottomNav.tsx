"use client";
import { useAppStore } from '../store/appStore';
import { Home, Wallet, Search, Bell, User } from 'lucide-react';

const tabs = [
  { id: 'inicio', label: 'Início', Icon: Home },
  { id: 'jornada', label: 'Minhas Finanças', Icon: Wallet },
  { id: 'busca', label: 'Busca', Icon: Search },
  { id: 'notificacoes', label: 'Alertas', Icon: Bell },
  { id: 'perfil', label: 'Perfil', Icon: User },
] as const;

export default function BottomNav() {
  const { tab, setTab, setScreen, notificacoes } = useAppStore();
  const unreadCount = notificacoes.filter(n => !n.lido).length;

  const handleTab = (id: typeof tabs[number]['id']) => {
    setTab(id);
    setScreen(id === 'inicio' ? 'home' : id === 'jornada' ? 'jornada' : id === 'busca' ? 'busca' : id === 'notificacoes' ? 'notificacoes' : 'perfil');
  };

  return (
    <nav
      style={{
        display: 'flex',
        borderTop: '1px solid #E8E8E8',
        backgroundColor: 'white',
        paddingBottom: 'env(safe-area-inset-bottom)',
        flexShrink: 0,
      }}
    >
      {tabs.map(({ id, label, Icon }) => {
        const isActive = tab === id;
        const showBadge = id === 'notificacoes' && unreadCount > 0;
        return (
          <button
            key={id}
            onClick={() => handleTab(id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px 8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? '#0033A0' : '#9E9E9E',
              position: 'relative',
              minWidth: 0,
            }}
          >
            {isActive && (
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 3,
                  background: '#FFCC00',
                  borderRadius: '0 0 4px 4px',
                }}
              />
            )}
            <span style={{ position: 'relative' }}>
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              {showBadge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    background: '#D32F2F',
                    color: 'white',
                    borderRadius: 10,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: '1px 4px',
                    minWidth: 16,
                    textAlign: 'center',
                  }}
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            <span style={{ fontSize: 10, marginTop: 3, fontWeight: isActive ? 700 : 400 }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
