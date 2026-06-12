"use client";
import { useState, useEffect } from 'react';
import { useAppStore, Jornada } from '../store/appStore';
import { X, CheckCircle2, AlertCircle, Award, ArrowRight, BookOpen, Star } from 'lucide-react';

const CHAPTER_DETAILS = [
  {
    capitulo: 1,
    titulo: 'Conhecendo sua realidade',
    descricao: 'A base da saúde financeira é entender para onde vai cada centavo. Vamos mapear seus gastos fixos e variáveis.',
    tarefas: [
      { id: 'c1_t1', texto: 'Mapear gastos fixos mensais (aluguel, contas)', pontos: 10 },
      { id: 'c1_t2', texto: 'Consultar extrato dos últimos 30 dias no app BB', pontos: 10 },
      { id: 'c1_t3', texto: 'Categorizar gastos supérfluos da semana', pontos: 10 }
    ],
    quiz: {
      pergunta: 'Qual a recomendação ideal para distribuição do orçamento mensal (Regra 50/30/20)?',
      opcoes: [
        '50% Essenciais, 30% Variáveis/Lazer, 20% Poupança',
        '80% Lazer, 20% Essenciais, 0% Poupança',
        '30% Essenciais, 50% Variáveis/Lazer, 20% Poupança',
        '50% Poupança, 30% Essenciais, 20% Lazer'
      ],
      respostaCorreta: 0,
      explicacao: 'A regra 50/30/20 sugere 50% para necessidades essenciais, 30% para desejos pessoais/lazer e 20% para poupança ou pagamento de dívidas.'
    }
  },
  {
    capitulo: 2,
    titulo: 'Eliminando desperdícios',
    descricao: 'Reduzir custos desnecessários é o caminho mais rápido para liberar margem para poupar. Foco em delivery e tarifas.',
    tarefas: [
      { id: 'c2_t1', texto: 'Reduzir em 20% o orçamento de delivery desta semana', pontos: 15 },
      { id: 'c2_t2', texto: 'Verificar e cancelar assinaturas que não utiliza', pontos: 15 },
      { id: 'c2_t3', texto: 'Estabelecer limite diário de gastos no cartão', pontos: 10 }
    ],
    quiz: {
      pergunta: 'Qual o impacto a longo prazo de economizar R$ 150/mês em tarifas ou assinaturas esquecidas?',
      opcoes: [
        'Nenhum impacto financeiro real',
        'Em 5 anos, investido a 10% a.a., acumula mais de R$ 11.000',
        'Apenas R$ 1.500 no total de 5 anos',
        'Permite comprar um imóvel em 2 anos'
      ],
      respostaCorreta: 1,
      explicacao: 'Graças aos juros compostos, pequenos valores recorrentes como R$ 150/mês poupados e investidos rendem montantes significativos ao longo do tempo.'
    }
  },
  {
    capitulo: 3,
    titulo: 'Construindo reservas',
    descricao: 'A reserva de emergência serve como escudo financeiro contra imprevistos, evitando que você precise contrair dívidas caras.',
    tarefas: [
      { id: 'c3_t1', texto: 'Definir o valor alvo da sua reserva (3 a 6 meses de custos)', pontos: 20 },
      { id: 'c3_t2', texto: 'Simular rendimento da poupança/CDB no app do BB', pontos: 10 },
      { id: 'c3_t3', texto: 'Ativar poupança automática programada recorrente', pontos: 15 }
    ],
    quiz: {
      pergunta: 'Quantos meses de custo de vida um profissional assalariado deve manter, em média, como reserva?',
      opcoes: [
        '1 mês é suficiente',
        'No mínimo 12 meses obrigatoriamente',
        'Entre 3 e 6 meses de despesas mensais',
        'Não há necessidade de reserva se tiver cartão de crédito'
      ],
      respostaCorreta: 2,
      explicacao: 'Especialistas recomendam de 3 a 6 meses de despesas essenciais guardadas em investimentos com liquidez imediata (resgate rápido).'
    }
  },
  {
    capitulo: 4,
    titulo: 'Acelerando o seu sonho',
    descricao: 'Hora de fazer seu dinheiro trabalhar por você. Vamos explorar investimentos de renda fixa e fundos com taxas atraentes.',
    tarefas: [
      { id: 'c4_t1', texto: 'Realizar análise de perfil de investidor (API) do BB', pontos: 20 },
      { id: 'c4_t2', texto: 'Conhecer a diferença entre LCI, LCA e CDB no BB', pontos: 15 },
      { id: 'c4_t3', texto: 'Fazer o primeiro investimento em Renda Fixa além da poupança', pontos: 25 }
    ],
    quiz: {
      pergunta: 'O que diferencia a LCI (Letra de Crédito Imobiliário) da maioria dos CDBs?',
      opcoes: [
        'A LCI tem maior risco de perda',
        'A LCI é isenta de Imposto de Renda para pessoa física',
        'LCI não tem garantia do FGC',
        'A LCI só pode ser resgatada após 10 anos'
      ],
      respostaCorreta: 1,
      explicacao: 'LCIs e LCAs são títulos isentos de Imposto de Renda para pessoas físicas, o que melhora a rentabilidade líquida frente aos CDBs em prazos semelhantes.'
    }
  },
  {
    capitulo: 5,
    titulo: 'Conquistando o objetivo',
    descricao: 'Você chegou à reta final. Mantenha o foco absoluto e prepare-se para colher os frutos do seu esforço continuado.',
    tarefas: [
      { id: 'c5_t1', texto: 'Simular o resgate final ou compra do seu sonho no BB', pontos: 30 },
      { id: 'c5_t2', texto: 'Finalizar desafio de consistência de 60 dias do Mentor', pontos: 20 },
      { id: 'c5_t3', texto: 'Compartilhar seu sucesso e receber medalha de ouro', pontos: 30 }
    ],
    quiz: {
      pergunta: 'Ao alcançar o objetivo, qual a atitude recomendada pelo BB Mentor?',
      opcoes: [
        'Gastar todo o saldo excedente imediatamente em lazer',
        'Comemorar a conquista e logo em seguida traçar o próximo sonho',
        'Parar de economizar definitivamente',
        'Manter o dinheiro parado na conta corrente sem rendimento'
      ],
      respostaCorreta: 1,
      explicacao: 'Celebrar as vitórias fortalece a disciplina mental. Traçar um novo objetivo logo em seguida perpetua o hábito virtuoso do acúmulo de riqueza.'
    }
  }
];

interface TrilhaModalProps {
  capituloId: number;
  onClose: () => void;
}

export default function TrilhaModal({ capituloId, onClose }: TrilhaModalProps) {
  const { jornadaAtiva, saveJornadaState } = useAppStore();
  const detail = CHAPTER_DETAILS.find(c => c.capitulo === capituloId);

  // Estados locais sincronizados
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const isHistoricallyCompleted = capituloId < (jornadaAtiva?.capitulo || 1);

  useEffect(() => {
    if (isHistoricallyCompleted) {
      setCompletedTasks(detail?.tarefas.map(t => t.id) || []);
      setQuizAnswered(true);
      if (detail?.quiz) {
        setSelectedOption(detail.quiz.respostaCorreta);
        setIsCorrect(true);
        setShowFeedback(true);
      }
    } else if (jornadaAtiva?.trilha_status?.[`cap_${capituloId}`]) {
      const status = jornadaAtiva.trilha_status[`cap_${capituloId}`];
      setCompletedTasks(status.completedTasks || []);
      setQuizAnswered(status.quizCompleted || false);
      if (status.quizCompleted && status.quizAnswer !== undefined) {
        setSelectedOption(status.quizAnswer);
        setIsCorrect(status.quizAnswer === detail?.quiz.respostaCorreta);
        setShowFeedback(true);
      }
    } else {
      setCompletedTasks([]);
      setQuizAnswered(false);
      setSelectedOption(null);
      setIsCorrect(false);
      setShowFeedback(false);
    }
  }, [jornadaAtiva, capituloId, detail, isHistoricallyCompleted]);

  if (!detail || !jornadaAtiva) return null;

  const handleToggleTask = async (taskId: string, pontos: number) => {
    if (isHistoricallyCompleted) return;

    let newCompleted: string[];
    let scoreDiff = 0;

    if (completedTasks.includes(taskId)) {
      newCompleted = completedTasks.filter(id => id !== taskId);
      scoreDiff = -pontos;
    } else {
      newCompleted = [...completedTasks, taskId];
      scoreDiff = pontos;
    }

    setCompletedTasks(newCompleted);

    // Salvar estado global e Supabase
    const currentStatus = jornadaAtiva.trilha_status || {};
    const updatedJornada: Jornada = {
      ...jornadaAtiva,
      score: Math.min(100, Math.max(0, jornadaAtiva.score + scoreDiff)),
      trilha_status: {
        ...currentStatus,
        [`cap_${capituloId}`]: {
          completedTasks: newCompleted,
          quizCompleted: quizAnswered,
          quizAnswer: selectedOption !== null ? selectedOption : undefined
        }
      }
    };
    await saveJornadaState(updatedJornada);
  };

  const handleQuizAnswer = async (optionIdx: number) => {
    if (isHistoricallyCompleted || quizAnswered) return;

    setSelectedOption(optionIdx);
    const correct = optionIdx === detail.quiz.respostaCorreta;
    setIsCorrect(correct);
    setShowFeedback(true);
    setQuizAnswered(true);

    const scoreDiff = correct ? 10 : 0; // Ganha 10 pontos se acertar de primeira

    // Salvar estado
    const currentStatus = jornadaAtiva.trilha_status || {};
    const updatedJornada: Jornada = {
      ...jornadaAtiva,
      score: Math.min(100, jornadaAtiva.score + scoreDiff),
      trilha_status: {
        ...currentStatus,
        [`cap_${capituloId}`]: {
          completedTasks: completedTasks,
          quizCompleted: true,
          quizAnswer: optionIdx
        }
      }
    };
    await saveJornadaState(updatedJornada);
  };

  const allTasksDone = completedTasks.length === detail.tarefas.length;
  const canCompleteChapter = allTasksDone && quizAnswered && isCorrect;

  const handleCompleteChapter = async () => {
    if (!canCompleteChapter) return;
    
    // Avança para o próximo capítulo
    const nextCap = jornadaAtiva.capitulo + 1;
    const updatedJornada: Jornada = {
      ...jornadaAtiva,
      capitulo: Math.min(5, nextCap),
      score: Math.min(100, jornadaAtiva.score + 15) // Bônus de 15 pontos por finalizar capítulo
    };
    await saveJornadaState(updatedJornada);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        fontFamily: 'inherit',
      }}
      onClick={onClose}
    >
      <div
        className="scrollable fade-in-up"
        style={{
          width: '100%',
          maxWidth: 450,
          background: 'white',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          color: '#1A1A1A',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: '#F0F4FF', color: '#0033A0', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>
              Capítulo {capituloId}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#FFCC00', fontSize: 12, fontWeight: 800 }}>
              <Star size={13} fill="#FFCC00" /> Trilha
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9E9E9E', cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 8px', color: '#0033A0' }}>
          {detail.titulo}
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: 13, color: '#6B6B6B', lineHeight: 1.5 }}>
          {detail.descricao}
        </p>

        {/* Checklist de Tarefas */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#6B6B6B' }}>
            Desafios de Aprendizado ({completedTasks.length}/{detail.tarefas.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {detail.tarefas.map(t => {
              const isChecked = completedTasks.includes(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => handleToggleTask(t.id, t.pontos)}
                  style={{
                    background: isChecked ? '#F0FFF4' : '#F9F9F9',
                    border: `1.5px solid ${isChecked ? '#00A651' : '#EAEAEA'}`,
                    borderRadius: 12,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: 10,
                    border: `2px solid ${isChecked ? '#00A651' : '#BDBDBD'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isChecked ? '#00A651' : 'none',
                    color: 'white', fontSize: 12, fontWeight: 800, flexShrink: 0,
                  }}>
                    {isChecked && '✓'}
                  </div>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: isChecked ? '#007A3B' : '#1A1A1A' }}>
                    {t.texto}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: isChecked ? '#00A651' : '#0033A0', background: isChecked ? '#E2FBE9' : '#EEF2FF', padding: '2px 8px', borderRadius: 8 }}>
                    +{t.pontos} XP
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quiz do Capítulo */}
        <div style={{ marginBottom: 24, padding: 16, background: '#F0F4FF', borderRadius: 16, border: '1px solid #C5D0F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <BookOpen size={16} color="#0033A0" />
            <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#0033A0' }}>
              Desafio Teórico do Mentor
            </h3>
          </div>
          <p style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.5 }}>
            {detail.quiz.pergunta}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {detail.quiz.opcoes.map((opcao, idx) => {
              const isSelected = selectedOption === idx;
              let btnBg = 'white';
              let btnBorder = '#D0D7EE';
              let btnColor = '#1A1A1A';

              if (quizAnswered) {
                if (idx === detail.quiz.respostaCorreta) {
                  btnBg = '#E2FBE9';
                  btnBorder = '#00A651';
                  btnColor = '#007A3B';
                } else if (isSelected) {
                  btnBg = '#FFEAEA';
                  btnBorder = '#D32F2F';
                  btnColor = '#C62828';
                }
              } else if (isSelected) {
                btnBg = '#EEF2FF';
                btnBorder = '#0033A0';
                btnColor = '#0033A0';
              }

              return (
                <button
                  key={idx}
                  disabled={quizAnswered}
                  onClick={() => handleQuizAnswer(idx)}
                  style={{
                    background: btnBg,
                    border: `1.5px solid ${btnBorder}`,
                    borderRadius: 10,
                    padding: '10px 12px',
                    textAlign: 'left',
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: btnColor,
                    cursor: quizAnswered ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {opcao}
                </button>
              );
            })}
          </div>

          {showFeedback && (
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              {isCorrect ? (
                <CheckCircle2 size={18} color="#00A651" style={{ flexShrink: 0, marginTop: 2 }} />
              ) : (
                <AlertCircle size={18} color="#D32F2F" style={{ flexShrink: 0, marginTop: 2 }} />
              )}
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: isCorrect ? '#007A3B' : '#C62828' }}>
                  {isCorrect ? 'Resposta Correta! +10 XP' : 'Resposta Incorreta! Tente analisar melhor.'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#555', lineHeight: 1.4 }}>
                  {detail.quiz.explicacao}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Ação final */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {canCompleteChapter ? (
            <button
              onClick={handleCompleteChapter}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00A651, #007A3B)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 10px rgba(0, 166, 81, 0.25)',
              }}
            >
              <Award size={18} /> Concluir Capítulo e Avançar (+15 XP) <ArrowRight size={16} />
            </button>
          ) : (
            <button
              disabled
              style={{
                width: '100%',
                background: '#EAEAEA',
                color: '#9E9E9E',
                border: 'none',
                borderRadius: 12,
                padding: '14px',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'default',
                textAlign: 'center',
              }}
            >
              Complete todos os desafios e acerte o quiz para concluir
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
