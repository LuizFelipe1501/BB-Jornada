import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'cole_sua_chave_aqui') {
    return Response.json({ ok: false, error: 'GEMINI_API_KEY não está configurada' }, { status: 500 });
  }

  // Mostra os primeiros e últimos 4 chars da chave para confirmar que está certa
  const maskedKey = `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Responda apenas: OK');
    const text = result.response.text();

    return Response.json({
      ok: true,
      key: maskedKey,
      model: 'gemini-1.5-flash',
      response: text.trim(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return Response.json({ ok: false, key: maskedKey, error: message }, { status: 500 });
  }
}
