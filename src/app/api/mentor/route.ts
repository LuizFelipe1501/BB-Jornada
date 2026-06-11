import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

const SYSTEM_PROMPT = `Você é o BB Mentor, o mentor financeiro pessoal e inteligente do Banco do Brasil.

Seu papel é agir como um guia financeiro contínuo — não um chatbot genérico. Você tem memória do contexto financeiro do usuário e fala de forma direta, humana e motivadora.

PERFIL DO USUÁRIO ATUAL:
- Nome: Luiz
- Renda mensal: R$ 5.800
- Gastos mensais: R$ 4.100
- Capacidade de poupança: R$ 1.700/mês
- Sonho atual: Comprar carro (Onix 2024)
- Meta: R$ 35.000
- Já guardou: R$ 14.200 (40,6% concluído)
- Prazo original: 24 meses
- Capítulo atual: 3 — Construindo Reservas
- Score Relacional: 72/100
- Principais gastos acima do limite: Delivery (R$ 450/mês, limite R$ 300) e Assinaturas (R$ 180/mês, limite R$ 100)
- Histórico: manteve disciplina nas últimas 6 semanas, 8% acima da meta mensal

REGRAS DE COMPORTAMENTO:
- Responda sempre em português brasileiro, tom informal mas profissional
- Seja direto e objetivo — máximo 4 parágrafos curtos
- Use dados reais do perfil do usuário nas respostas
- Quando detectar um padrão de risco, mencione com cuidado mas sem alarmismo
- Use emojis com moderação (1-2 por resposta no máximo)
- Nunca invente produtos ou taxas do Banco do Brasil
- Se perguntarem algo fora do escopo financeiro, redirecione gentilmente
- Sempre termine com uma ação concreta que o usuário pode tomar agora
- Você tem memória: referencie o histórico e os dados do usuário naturalmente`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'cole_sua_chave_aqui') {
    return Response.json(
      { error: 'GEMINI_API_KEY não configurada. Adicione no .env.local ou nas variáveis de ambiente da Vercel.' },
      { status: 500 }
    );
  }

  let body: { messages: { role: string; text: string }[]; currentMessage: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { messages, currentMessage } = body;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Monta histórico no formato do Gemini
    const history = messages
      .filter((m) => m.role !== 'ai' || messages.indexOf(m) !== 0) // remove a mensagem inicial do sistema
      .map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history });

    // Streaming
    const result = await chat.sendMessageStream(currentMessage);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Gemini API error:', message);
    return Response.json({ error: `Erro na API Gemini: ${message}` }, { status: 500 });
  }
}
