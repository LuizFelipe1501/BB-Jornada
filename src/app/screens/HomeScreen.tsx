"use client";
import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { ChevronRight, Zap, X, ShieldAlert, CheckCircle2 } from 'lucide-react';

const quickActions = [
  { label: 'Pix', icon: '⚡' },
  { label: 'Pagar', icon: '📄' },
  { label: 'Cartões', icon: '💳' },
  { label: 'Invest.', icon: '📈' },
  { label: 'Crédito', icon: '🏦' },
];

export default function HomeScreen() {
  const { 
    saldoVisible, 
    saldo, 
    jornadaAtiva, 
    setTab, 
    setScreen, 
    transacoes, 
    realizarTransacao 
  } = useAppStore();

  const [activeModal, setActiveModal] = useState<'extrato' | 'lancamentos' | 'pix' | 'pagar' | 'cartoes' | 'invest' | 'credito' | null>(null);

  // States para formulários do Pix
  const [pixKey, setPixKey] = useState('');
  const [pixName, setPixName] = useState('');
  const [pixAmount, setPixAmount] = useState('');
  const [pixCategory, setPixCategory] = useState('Transferência');

  // States para Pagamentos
  const [payDesc, setPayDesc] = useState('');
  const [payAmount, setPayAmount] = useState('');

  // States para Investimentos
  const [investType, setInvestType] = useState('CDB Fácil');
  const [investAmount, setInvestAmount] = useState('');

  // Toast / Feedback states
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handlePixSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(pixAmount);
    if (isNaN(amount) || amount <= 0) {
      showFeedback('error', 'Digite um valor de Pix válido.');
      return;
    }
    if (amount > saldo) {
      showFeedback('error', 'Saldo insuficiente para realizar o Pix.');
      return;
    }
    const name = pixName.trim() || 'João';
    realizarTransacao(`Pix enviado para ${name}`, amount, 'debito', pixCategory);
    setActiveModal(null);
    showFeedback('success', `Pix de R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} enviado com sucesso!`);
    
    // Limpar campos
    setPixKey('');
    setPixName('');
    setPixAmount('');
    setPixCategory('Transferência');
  };

  const handlePaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      showFeedback('error', 'Digite um valor de boleto válido.');
      return;
    }
    if (amount > saldo) {
      showFeedback('error', 'Saldo insuficiente para pagar o boleto.');
      return;
    }
    const desc = payDesc.trim() || 'Conta de Consumo';
    realizarTransacao(`Boleto pago: ${desc}`, amount, 'debito', 'Pagamento');
    setActiveModal(null);
    showFeedback('success', `Boleto de R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} pago com sucesso!`);
    
    setPayDesc('');
    setPayAmount('');
  };

  const handlePayFatura = () => {
    const amount = 740.00;
    if (amount > saldo) {
      showFeedback('error', 'Saldo em conta insuficiente para quitar a fatura.');
      return;
    }
    realizarTransacao('Pagamento de Fatura Cartão BB', amount, 'debito', 'Cartões');
    setActiveModal(null);
    showFeedback('success', 'Fatura do cartão de R$ 740,00 quitada com sucesso!');
  };

  const handleInvestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(investAmount);
    if (isNaN(amount) || amount <= 0) {
      showFeedback('error', 'Digite um valor de aplicação válido.');
      return;
    }
    if (amount > saldo) {
      showFeedback('error', 'Saldo insuficiente para realizar o investimento.');
      return;
    }
    realizarTransacao(`Aplicação em ${investType}`, amount, 'debito', 'Investimento');
    setActiveModal(null);
    showFeedback('success', `R$ ${amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} aplicados em ${investType}!`);
    setInvestAmount('');
  };

  const handleCreditSubmit = (amountVal: number) => {
    realizarTransacao('Crédito Pessoal Contratado', amountVal, 'credito', 'Crédito');
    setActiveModal(null);
    showFeedback('success', `Crédito de R$ ${amountVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} contratado e creditado na conta!`);
  };

  const isLivre = jornadaAtiva?.meta_livre;
  
  // Cálculo de marcos para a Meta Livre
  const milestones = [500, 1500, 5000, 10000, 20000, 50000];
  let nextMilestone = milestones[0];
  let prevMilestone = 0;
  if (jornadaAtiva) {
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
  }

  const range = nextMilestone - prevMilestone;
  const progressInRange = jornadaAtiva ? Math.max(0, jornadaAtiva.acumulado - prevMilestone) : 0;
  const porcentagemLivre = Math.min(100, Math.round((progressInRange / range) * 100));

  const porcentagem = jornadaAtiva
    ? (isLivre ? porcentagemLivre : Math.round((jornadaAtiva.acumulado / (jornadaAtiva.valor || 1)) * 100))
    : 0;

  const handleActionClick = (label: string) => {
    if (label === 'Pix') setActiveModal('pix');
    if (label === 'Pagar') setActiveModal('pagar');
    if (label === 'Cartões') setActiveModal('cartoes');
    if (label === 'Invest.') setActiveModal('invest');
    if (label === 'Crédito') setActiveModal('credito');
  };

  return (
    <div className="scrollable" style={{ flex: 1, padding: '0 0 8px', position: 'relative' }}>
      
      {/* Feedback Toast */}
      {feedback && (
        <div style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          background: feedback.type === 'success' ? '#E2FBE9' : '#FFF3F3',
          border: `1.5px solid ${feedback.type === 'success' ? '#00A651' : '#D32F2F'}`,
          borderRadius: 12,
          padding: '12px 20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          animation: 'fade-in-up 0.3s ease',
          width: '90%',
          maxWidth: 380,
        }}>
          {feedback.type === 'success' 
            ? <CheckCircle2 color="#00A651" size={20} style={{ flexShrink: 0 }} /> 
            : <ShieldAlert color="#D32F2F" size={20} style={{ flexShrink: 0 }} />
          }
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{feedback.message}</span>
        </div>
      )}

      {/* Saldo */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="bb-card" style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Saldo conta</p>
            <p style={{ margin: '4px 0 6px', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>
              {saldoVisible ? `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'R$ •••'}
            </p>
            <button 
              onClick={() => setActiveModal('extrato')}
              style={{ background: 'none', border: 'none', color: '#0033A0', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Ver extrato <ChevronRight size={14} />
            </button>
          </div>
          <div className="bb-card" style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, color: '#6B6B6B' }}>Agendamentos</p>
            <p style={{ margin: '4px 0 6px', fontWeight: 700, fontSize: 22, color: '#1A1A1A' }}>R$ 262,20</p>
            <button 
              onClick={() => setActiveModal('lancamentos')}
              style={{ background: 'none', border: 'none', color: '#0033A0', fontWeight: 600, fontSize: 13, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Ver lançamentos <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Ações rápidas */}
      <div style={{ padding: '20px 16px 0', overflowX: 'auto', display: 'flex', gap: 20 }}>
        {quickActions.map((a) => (
          <div 
            key={a.label} 
            onClick={() => handleActionClick(a.label)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer' }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 28,
              background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              transition: 'transform 0.1s ease',
            }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
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
              boxShadow: '0 8px 20px rgba(0, 51, 160, 0.15)',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            onClick={() => { setTab('jornada'); setScreen('jornada'); }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#FFCC00" fill="#FFCC00" />
                  <span style={{ color: '#FFCC00', fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>
                    {isLivre ? 'META LIVRE ATIVA' : 'JORNADA ATIVA'}
                  </span>
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
                {isLivre ? `Marco: R$ ${nextMilestone.toLocaleString('pt-BR')}` : `Meta: R$ ${jornadaAtiva.valor?.toLocaleString('pt-BR')}`}
              </span>
            </div>

            {/* AI Insight preview */}
            <div style={{
              marginTop: 12, background: 'rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '10px 12px',
              borderLeft: '3px solid #FFCC00',
            }}>
              <p style={{ margin: 0, color: 'white', fontSize: 13, lineHeight: 1.4 }}>
                💡 &ldquo;{isLivre ? 'Foco no acúmulo contínuo! Cada pequena economia conta para bater o próximo marco.' : 'Você está 8% à frente da meta. Se manter o ritmo, chegará 2 meses antes.'}&rdquo;
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

      {/* RENDERIZACAO DE MODAIS (SIMULADORES INTERATIVOS) */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 999,
          animation: 'fade-in 0.2s ease',
        }}>
          {/* Modal Content */}
          <div style={{
            background: 'white',
            width: '100%',
            borderRadius: '24px 24px 0 0',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 -8px 32px rgba(0,0,0,0.15)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #F0F0F0',
              background: '#F9FAFB',
            }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0033A0' }}>
                {activeModal === 'extrato' && 'Extrato de Conta'}
                {activeModal === 'lancamentos' && 'Lançamentos Agendados'}
                {activeModal === 'pix' && '⚡ Enviar Pix (Simulador)'}
                {activeModal === 'pagar' && '📄 Pagamento de Boleto (Simulador)'}
                {activeModal === 'cartoes' && '💳 Fatura de Cartões'}
                {activeModal === 'invest' && '📈 Realizar Investimento'}
                {activeModal === 'credito' && '🏦 Simulação de Crédito BB'}
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                style={{ background: 'none', border: 'none', color: '#6B6B6B', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              
              {/* MODAL: EXTRATO */}
              {activeModal === 'extrato' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 13, color: '#6B6B6B', margin: '0 0 4px' }}>Lançamentos mais recentes da conta corrente</p>
                  {transacoes.map((t) => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F2F2F2' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>{t.descricao}</p>
                        <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9E9E9E' }}>{t.categoria} · {t.data}</p>
                      </div>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: t.tipo === 'credito' ? '#00A651' : '#D32F2F' }}>
                        {t.tipo === 'credito' ? '+' : '-'} R$ {t.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* MODAL: LANCAMENTOS */}
              {activeModal === 'lancamentos' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <p style={{ fontSize: 13, color: '#6B6B6B', margin: '0 0 4px' }}>Débitos programados ou faturas automáticas futuras</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F2F2F2' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Luz (Neoenergia S.A.)</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9E9E9E' }}>Débito automático programado · 25/06/2026</p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1A1A1A' }}>R$ 142,30</p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: '1px solid #F2F2F2' }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#1A1A1A' }}>Internet Claro Fibra</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9E9E9E' }}>Débito automático programado · 28/06/2026</p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 14, color: '#1A1A1A' }}>R$ 119,90</p>
                  </div>
                </div>
              )}

              {/* MODAL: PIX */}
              {activeModal === 'pix' && (
                <form onSubmit={handlePixSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Chave Pix</label>
                    <input 
                      type="text"
                      placeholder="CPF, e-mail, celular ou chave aleatória"
                      value={pixKey}
                      onChange={e => setPixKey(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Nome do Recebedor</label>
                    <input 
                      type="text"
                      placeholder="Ex: João da Silva"
                      value={pixName}
                      onChange={e => setPixName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Valor (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={pixAmount}
                      onChange={e => setPixAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Categoria de Gasto</label>
                    <select
                      value={pixCategory}
                      onChange={e => setPixCategory(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A',
                        background: 'white',
                        height: 44
                      }}
                    >
                      <option value="Transferência">💸 Transferência comum</option>
                      <option value="Alimentação">🍔 Alimentação / Almoço</option>
                      <option value="Lazer">🎮 Lazer / Entretenimento</option>
                      <option value="Meta">🎯 Poupança da Meta (Soma na Jornada!)</option>
                    </select>
                  </div>
                  <button type="submit" className="bb-btn-primary" style={{ marginTop: 10 }}>
                    Confirmar Envio do Pix
                  </button>
                </form>
              )}

              {/* MODAL: BOLETO */}
              {activeModal === 'pagar' && (
                <form onSubmit={handlePaySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Código de Barras</label>
                    <input 
                      type="text"
                      placeholder="00190.00009 03124.000004 00001.900007..."
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Descrição do Boleto</label>
                    <input 
                      type="text"
                      placeholder="Ex: Condomínio, Faculdade, Convênio..."
                      value={payDesc}
                      onChange={e => setPayDesc(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Valor (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={payAmount}
                      onChange={e => setPayAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <button type="submit" className="bb-btn-primary" style={{ marginTop: 10 }}>
                    Pagar Boleto
                  </button>
                </form>
              )}

              {/* MODAL: CARTÕES */}
              {activeModal === 'cartoes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {/* Cartao Visual */}
                  <div style={{
                    background: 'linear-gradient(135deg, #001A4E 0%, #0033A0 100%)',
                    borderRadius: 16,
                    padding: 20,
                    color: 'white',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}>
                    <p style={{ margin: 0, fontSize: 11, letterSpacing: 2, color: '#FFCC00', fontWeight: 700 }}>OUROCARD VISA</p>
                    <p style={{ margin: '20px 0 12px', fontSize: 18, fontFamily: 'monospace', letterSpacing: 3 }}>•••• •••• •••• 9821</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>LIMITE DISPONÍVEL</p>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>R$ 4.260,00</p>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 600 }}>06/32</p>
                    </div>
                  </div>
                  
                  {/* Fatura Details */}
                  <div style={{ background: '#FAFAFA', border: '1px solid #EAEAEA', borderRadius: 12, padding: 14, marginTop: 4 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: '#6B6B6B' }}>Fatura em aberto</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#D32F2F' }}>R$ 740,00</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: '#6B6B6B' }}>Vencimento</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>25/06/2026</span>
                    </div>
                    <button 
                      onClick={handlePayFatura}
                      className="bb-btn-primary"
                    >
                      Pagar Fatura com Saldo
                    </button>
                  </div>
                </div>
              )}

              {/* MODAL: INVESTIMENTOS */}
              {activeModal === 'invest' && (
                <form onSubmit={handleInvestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Fundo / Modalidade</label>
                    <select
                      value={investType}
                      onChange={e => setInvestType(e.target.value)}
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A',
                        background: 'white',
                        height: 44
                      }}
                    >
                      <option value="CDB Fácil">🏦 CDB Fácil BB (Liquidez Diária)</option>
                      <option value="LCI DI">🏛️ LCI DI (Isento de Imposto de Renda)</option>
                      <option value="Tesouro Selic 2029">🚀 Tesouro Selic (Segurança de Longo Prazo)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 700, color: '#6B6B6B', display: 'block', marginBottom: 6 }}>Valor da Aplicação (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={investAmount}
                      onChange={e => setInvestAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        border: '1.5px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '10px 14px',
                        fontSize: 14,
                        outline: 'none',
                        color: '#1A1A1A'
                      }}
                    />
                  </div>
                  <button type="submit" className="bb-btn-primary" style={{ marginTop: 10 }}>
                    Confirmar Aplicação
                  </button>
                </form>
              )}

              {/* MODAL: CREDITO */}
              {activeModal === 'credito' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ border: '1.5px solid #FF8C00', background: '#FFF8E7', borderRadius: 14, padding: 14 }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#FF8C00', fontWeight: 700, letterSpacing: 1 }}>CRÉDITO PRÉ-APROVADO</p>
                    <p style={{ margin: '6px 0 0', fontSize: 13, lineHeight: 1.5, color: '#1A1A1A' }}>
                      Parabéns! Você tem um crédito pré-aprovado de até **R$ 10.000,00** disponível na sua conta agora.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button 
                      onClick={() => handleCreditSubmit(2000)}
                      className="bb-btn-primary" 
                      style={{ background: '#FF8C00', borderColor: '#FF8C00' }}
                    >
                      Contratar R$ 2.000,00
                    </button>
                    <button 
                      onClick={() => handleCreditSubmit(5000)}
                      className="bb-btn-primary"
                    >
                      Contratar R$ 5.000,00
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
