"use client";
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
  const { screen, setScreen, setTab } = useAppStore();

  const showHeader = screen !== 'detalhe-jornada' && screen !== 'nova-jornada';
  const showBack = screensWithBack.includes(screen);
  const title = screenTitles[screen] || '';

  const handleBack = () => {
    if (screen === 'nova-jornada') { setScreen('jornada'); setTab('jornada'); }
    if (screen === 'detalhe-jornada') { setScreen('jornada'); }
  };

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
