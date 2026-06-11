import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

// Aumenta o timeout na Vercel para 30s (necessário para streaming)
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'cole_sua_chave_aqui') {
    return Response.json(
      { error: 'GEMINI_API_KEY não configurada. Adicione nas variáveis de ambiente da Vercel.' },
      { status: 500 }
    );
  }

  let body: { 
    messages: { role: string; text: string }[]; 
    currentMessage: string;
    jornada?: {
      sonho: string;
      valor: number | null;
      prazo: number | null;
      acumulado: number;
      capitulo: number;
      score: number;
      meta_livre: boolean;
    };
    user?: {
      nome: string;
      rendaMensal: number;
      gastosMensais: number;
    };
    transacoes?: {
      id: string;
      descricao: string;
      valor: number;
      tipo: 'debito' | 'credito';
      categoria: string;
      data: string;
    }[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { messages, currentMessage, jornada, user, transacoes } = body;

  const formattedTransacoes = transacoes && transacoes.length > 0
    ? transacoes.map(t => `- [${t.tipo === 'credito' ? 'Entrada/Crédito' : 'Saída/Débito'}] ${t.descricao}: R$ ${t.valor.toFixed(2)} (${t.categoria}, ${t.data})`).join('\n')
    : '- Nenhuma transação recente registrada.';

  // Constrói o System Prompt de forma dinâmica com os dados do Jurado atual
  const dynamicSystemPrompt = `Você é o BB Mentor, o mentor financeiro pessoal e inteligente do Banco do Brasil.

Seu papel é agir como um guia financeiro contínuo — não um chatbot genérico. Você tem memória do contexto financeiro do usuário, incluindo as transações bancárias, extrato, faturas e transferências. Você fala de forma direta, humana e motivadora.

PERFIL DO USUÁRIO ATUAL:
- Nome: ${user?.nome || 'Luiz'}
- Renda mensal: R$ ${user?.rendaMensal || 5800}
- Gastos mensais: R$ ${user?.gastosMensais || 4100}
- Capacidade de poupança: R$ ${(user?.rendaMensal && user?.gastosMensais) ? (user.rendaMensal - user.gastosMensais) : 1700}/mês
${jornada ? `
- Sonho atual: ${jornada.sonho}
- Modalidade: ${jornada.meta_livre ? 'Meta Livre (Sem valor/prazo específicos)' : 'Meta Definida'}
- Meta financeira: ${jornada.meta_livre ? 'Acúmulo contínuo' : `R$ ${jornada.valor}`}
- Já guardou: R$ ${jornada.acumulado} (${jornada.meta_livre ? 'Sem limite' : `${Math.round((jornada.acumulado / (jornada.valor || 1)) * 100)}% concluído`})
- Prazo original: ${jornada.meta_livre ? 'Sem prazo' : `${jornada.prazo} meses`}
- Capítulo atual da Trilha: ${jornada.capitulo}
- Score Relacional: ${jornada.score}/100
` : `
- Sonho atual: Comprar carro (Onix 2024)
- Meta: R$ 35.000
- Já guardou: R$ 14.200 (40,6% concluído)
- Prazo original: 24 meses
- Capítulo atual: 3 — Construindo Reservas
- Score Relacional: 72/100
`}

HISTÓRICO RECENTE DE TRANSAÇÕES DO USUÁRIO (Extrato de Faturas, Pix e Transferências):
${formattedTransacoes}

REGRAS DE COMPORTAMENTO:
- Responda sempre em português brasileiro, tom informal mas profissional.
- Seja direto e objetivo — máximo 4 parágrafos curtos.
- Analise os gastos reais do extrato acima (faturas, Pix e transferências) nas respostas quando o usuário perguntar sobre gastos ou onde economizar.
- Quando detectar um padrão de risco (ex: gastos frequentes com delivery ou Pix transferências desnecessárias), mencione com cuidado mas sem alarmismo.
- Use emojis com moderação (1-2 por resposta no máximo).
- Nunca invente produtos ou taxas do Banco do Brasil.
- Se perguntarem algo fora do escopo financeiro, redirecione gentilmente.
- Sempre termine com uma ação concreta que o usuário pode tomar agora.
- Você tem memória: referencie o histórico, faturas, Pix e dados do usuário naturalmente.`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: dynamicSystemPrompt,
    });

    // Monta histórico corretamente para o Gemini:
    // - Exclui a primeira mensagem (saudação da IA que é gerada localmente)
    // - Garante alternância estrita user → model
    // - Exclui mensagens vazias ou com erro
    const rawHistory = messages[0]?.role === 'ai' || messages[0]?.role === 'model'
      ? messages.slice(1)
      : messages;


    type GeminiRole = 'user' | 'model';
    const history: { role: GeminiRole; parts: { text: string }[] }[] = [];

    for (const m of rawHistory) {
      if (!m.text || m.text.trim() === '') continue;
      const role: GeminiRole = m.role === 'user' ? 'user' : 'model';
      const last = history[history.length - 1];
      if (last && last.role === role) {
        // Mescla com a anterior para manter alternância
        last.parts[0].text += '\n' + m.text;
      } else {
        history.push({ role, parts: [{ text: m.text }] });
      }
    }

    // O Gemini exige que o histórico termine com 'model' (não 'user')
    // porque vamos enviar currentMessage como o próximo 'user'
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history.pop();
    }

    const chat = model.startChat({ history });

    const result = await chat.sendMessageStream(currentMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamErr) {
          console.error('Stream error:', streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no', // desativa buffering no nginx/vercel
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Gemini API error:', message);

    // Mensagem de erro mais específica para debug
    let userMessage = 'Erro ao conectar com o BB Mentor.';
    if (message.includes('API_KEY') || message.includes('key')) {
      userMessage = 'Chave de API inválida. Verifique a variável GEMINI_API_KEY na Vercel.';
    } else if (message.includes('quota') || message.includes('limit')) {
      userMessage = 'Limite de uso da API atingido. Tente novamente em alguns minutos.';
    } else if (message.includes('model')) {
      userMessage = 'Modelo não disponível. Verifique se sua chave tem acesso ao Gemini.';
    }

    return Response.json({ error: userMessage }, { status: 500 });
  }
}
