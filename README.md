# vitrine-cardapio

Modelo de site para restaurantes com cardápio digital e pedido direto no WhatsApp.
Cada cliente é um clone deste repositório com a própria configuração, imagens e cardápio.

## Stack

- Next.js (App Router) + TypeScript
- Vitest + Testing Library
- Kit de design da taste-skill em `public/assets`
- Deploy na Vercel

## Rodando localmente

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm test           # testes
npm run lint
npm run build
```

## Variáveis de ambiente

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_DEMO_MODE` | `true` mostra a faixa de demonstração e bloqueia a indexação no Google |
| `CARDAPIO_SHEET_URL` | CSV publicado da planilha do Google com o cardápio (opcional) |

## Documentação

- Design: `docs/superpowers/specs/`
- Plano de implementação: `docs/superpowers/plans/`
