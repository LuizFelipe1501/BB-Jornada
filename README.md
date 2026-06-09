# BB Jornada — Hackathon Banco do Brasil

Protótipo funcional para o Hackathon do BB. Implementa a proposta de **IA Relacional** para o Minhas Finanças.

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## Deploy na Vercel

### Opção 1 — Via Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Opção 2 — Via GitHub
1. Suba o projeto para um repositório GitHub
2. Acesse vercel.com → New Project
3. Importe o repositório
4. Deploy automático (Next.js detectado automaticamente)

## Estrutura

```
src/app/
  store/        → Estado global (Zustand)
  components/   → BottomNav, TopHeader
  screens/      → Todas as telas do app
```

## Telas implementadas

- **Início** — Home do banco com card de Jornada Ativa
- **Jornada** — Hub principal com Score Relacional, Capítulos, Insights
- **Nova Jornada** — Fluxo de criação com análise de IA (4 etapas)
- **Detalhe Jornada** — Chat com BB Mentor + Gráfico + Gastos
- **Notificações** — Insights proativos da IA
- **Busca** — Busca no app
- **Perfil** — Score, conquistas, resumo financeiro

## Conceito

A Jornada do Herói transforma metas financeiras em objetivos de vida, com um mentor de IA que:
- Tem memória relacional do histórico do usuário
- Gera insights proativos e personalizados
- Guia pelo usuário por 5 capítulos até conquistar o objetivo
- Detecta padrões de risco e oportunidades de economia
