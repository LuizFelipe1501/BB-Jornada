"use client";
import { useEffect } from 'react';
import { useAppStore } from './store/appStore';
import BottomNav from './components/BottomNav';
import TopHeader from './components/TopHeader';
import HomeScreen from './screens/HomeScreen';
import JornadaScreen from './screens/JornadaScreen';
import NovaJornadaScreen from './screens/NovaJornadaScreen';
import DetalheJornadaScreen from './screens/DetalheJornadaScreen';
import NotificacoesScreen from './screens/NotificacoesScreen';
import BuscaScreen from './screens/BuscaScreen';
import PerfilScreen from './screens/PerfilScreen';

const screenTitles: Record<string, string> = {
  home: '',
  jornada: 'Minha Jornada',
  'nova-jornada': '',
  'detalhe-jornada': '',
  notificacoes: 'Insights',
  busca: 'Busca',
  perfil: 'Perfil',
};

const screensWithBack = ['nova-jornada', 'detalhe-jornada'];

export default function Page() {
  const { screen, setScreen, setTab, initializeUserSession, loadingDatabase, jornadaAtiva } = useAppStore();

  useEffect(() => {
    initializeUserSession();
  }, [initializeUserSession]);

  const showHeader = screen !== 'detalhe-jornada' && screen !== 'nova-jornada';
  const showBack = screensWithBack.includes(screen);
  const title = screenTitles[screen] || '';

  const handleBack = () => {
    if (screen === 'nova-jornada') { setScreen('jornada'); setTab('jornada'); }
    if (screen === 'detalhe-jornada') { setScreen('jornada'); }
  };

  // Carregamento inicial transparente do Supabase
  if (loadingDatabase && !jornadaAtiva) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #001A4E 0%, #00297B 50%, #0033A0 100%)',
        color: 'white',
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.2)',
          borderTopColor: '#FFCC00',
          animation: 'spin 1s linear infinite',
          marginBottom: 16
        }} />
        <span style={{ fontSize: 14, color: '#FFCC00', fontWeight: 600 }}>Carregando dados do BB...</span>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div id="app-shell">
      {showHeader && (
        <TopHeader
          title={title || undefined}
          showBack={showBack}
          onBack={handleBack}
        />
      )}

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {screen === 'home' && <HomeScreen />}
        {screen === 'jornada' && <JornadaScreen />}
        {screen === 'nova-jornada' && <NovaJornadaScreen />}
        {screen === 'detalhe-jornada' && <DetalheJornadaScreen />}
        {screen === 'notificacoes' && <NotificacoesScreen />}
        {screen === 'busca' && <BuscaScreen />}
        {screen === 'perfil' && <PerfilScreen />}
      </div>

      <BottomNav />
    </div>
  );
}
