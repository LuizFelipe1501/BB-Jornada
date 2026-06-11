# BB Jornada — Hackathon Banco do Brasil

Protótipo funcional com **IA real via Gemini** para o Hackathon do BB.
Implementa a proposta de IA Relacional para o Minhas Finanças.

---

## Configurar a chave do Gemini

Antes de rodar, crie o arquivo `.env.local` na raiz do projeto:

```bash
GEMINI_API_KEY=sua_chave_aqui
```

Para obter a chave: https://aistudio.google.com/app/apikey

---

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## Deploy na Vercel

### Opção 1 — Via GitHub (recomendado)
1. Suba o projeto para um repositório GitHub
2. Acesse vercel.com → New Project → importe o repositório
3. Em **Environment Variables**, adicione:
   - `GEMINI_API_KEY` = sua chave
4. Deploy automático (Next.js detectado automaticamente)

### Opção 2 — Via Vercel CLI
```bash
npm i -g vercel
vercel env add GEMINI_API_KEY   # cola a chave quando pedir
vercel --prod
```

---

## Como a IA funciona

O chat do **BB Mentor** usa a API Gemini 2.0 Flash com:
- **Streaming real** — o texto aparece palavra por palavra
- **System prompt contextualizado** com os dados financeiros do usuário
- **Histórico de conversa** — o Gemini lembra o que foi dito no chat
- **Rota API segura** em `/api/mentor` — a chave nunca vai pro browser

---

## Estrutura do projeto

```
src/app/
  api/mentor/route.ts   → API route Gemini com streaming
  store/appStore.ts     → Estado global (Zustand)
  components/           → BottomNav, TopHeader
  screens/              → Todas as telas do app
```

## Telas implementadas

| Tela | Descrição |
|------|-----------|
| 🏠 Início | Home do banco com card de Jornada Ativa |
| 🎯 Jornada | Score Relacional, Capítulos, Insights da IA |
| ✨ Nova Jornada | Fluxo 4 etapas com simulação de análise |
| 🤖 BB Mentor | Chat com Gemini real + streaming + histórico |
| 📊 Evolução | Gráfico de barras mensal |
| 💸 Gastos | Gastos vs. limites com alertas |
| 🔔 Notificações | Insights proativos da IA |
| 👤 Perfil | Score, conquistas, resumo financeiro |
