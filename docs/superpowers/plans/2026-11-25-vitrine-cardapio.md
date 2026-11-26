# Vitrine Cardápio + Demo Tempero Mineiro — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir o modelo `vitrine-cardapio` (site de restaurante com cardápio e pedido pelo WhatsApp) e gerar dele a demo `tempero-mineiro-site`, publicada na Vercel.

**Architecture:** Next.js App Router de uma página. A lógica pura (carrinho, mensagem, horário, planilha) fica em `src/lib` e é testada com Vitest. A UI usa o kit da taste-skill (`public/assets`) mais CSS Modules. Os dados do cliente ficam em `src/config/cliente.ts` e o cardápio vem da planilha do Google (com ISR de 300 s) ou do `src/data/cardapio.json`.

**Tech Stack:** Next.js (última estável, App Router, TypeScript), React, Vitest + Testing Library, ESLint, Vercel.

**Spec:** `docs/superpowers/specs/2026-11-25-vitrine-cardapio-design.md`

## Global Constraints

- Node 22+, npm. Sem Tailwind. Sem banco, login ou pagamento online.
- Preços sempre em **centavos (inteiro)** no código; formatação só na borda (`formatBRL`).
- Fuso de horário: `America/Sao_Paulo`.
- Modo demo por `NEXT_PUBLIC_DEMO_MODE=true`: faixa fixa, `robots: { index: false, follow: false }` e `robots.txt` com `Disallow: /`.
- Planilha: env `CARDAPIO_SHEET_URL` (CSV publicado); colunas `categoria,nome,descricao,preco,foto,disponivel`; revalidação de 300 s; fallback para `src/data/cardapio.json`.
- Commits: conventional commits, tipo/escopo em inglês e descrição em português (`feat(cart): adiciona gaveta do carrinho`). Trabalho em `feat/*`/`fix/*`, merge `--no-ff` na `main`.
- Visual tipo "place" da taste-skill: base clara, fotos grandes, cantos retos, um estilo de botão, sem fundo escuro, sem efeitos ou shaders, hero com `data-enter`, 1–2 momentos dealt.
- Kit da taste-skill: `TASTE=<pasta da taste-skill>`.
- Waiver obrigatório no gate: regra 9 (endereço completo e WhatsApp real do próprio cliente; ver spec §3).
- Toque ≥ 44px; funcionar em 320, 390, 768, 1024 e 1440.

## Review Focus

1. **Preço da planilha em formato brasileiro** (`25,00`, `R$ 25,00`, `25.5`): precisa virar 2500/2550, nunca NaN nem 25 centavos. → teste na Task 4.
2. **Descrição com vírgulas e aspas no CSV** (`"ACOMPANHA ARROZ, FEIJÃO"`): o campo não pode quebrar em colunas. → teste na Task 4.
3. **Caracteres especiais na mensagem** (`&`, `#`, acentos, emoji, quebras de linha): o link `wa.me` precisa chegar íntegro. → teste na Task 3.
4. **Carrinho salvo com item que saiu do cardápio ou mudou de preço:** ao reidratar, remove o que não existe e usa o preço atual. → teste na Task 2.
5. **Entrega sem endereço / dinheiro sem troco:** o formulário bloqueia o envio com o erro embaixo do campo; troco vazio é aceito como "sem troco". → teste na Task 8.

---

### Task 1: Base do projeto (modelo)

**Files:**
- Create: projeto Next.js em `~/projetos/vitrine-cardapio` (mantendo a pasta `docs/` existente), `vitest.config.ts`, `tests/setup.ts`, `.env.example`, `README.md`, `public/assets/` (cópia de `$TASTE/assets`)

**Interfaces:**
- Produces: scripts `npm run dev | build | lint | test`; alias `@/*` → `src/*`.

- [ ] **Step 1:** `git init -b main` e commit da pasta `docs/` (`docs: adiciona design e plano de implementação`).
- [ ] **Step 2:** Consultar a doc atual do Next.js (Context7) e criar o app numa pasta temporária: `npx create-next-app@latest tmp-app --ts --eslint --app --src-dir --no-tailwind --import-alias "@/*" --use-npm --yes`; mover o conteúdo para a raiz, sem sobrescrever `docs/`.
- [ ] **Step 3:** Instalar `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event` como devDependencies; `vitest.config.ts` com environment `jsdom`, alias `@`, setup `tests/setup.ts`; script `"test": "vitest run"`.
- [ ] **Step 4:** Copiar `$TASTE/assets` para `public/assets` (sem editar arquivos do kit). `.env.example` com `NEXT_PUBLIC_DEMO_MODE=true` e `CARDAPIO_SHEET_URL=`.
- [ ] **Step 5:** Verificar: `npm run lint && npm run build` → sem erros; `npm test` → "No test files found" sem crash (ou passWithNoTests).
- [ ] **Step 6:** Commit `chore: cria projeto next.js com typescript e vitest`.

### Task 2: Formatação e carrinho

**Files:**
- Create: `src/lib/menu/types.ts`, `src/lib/format/currency.ts`, `src/lib/cart/cart.ts`
- Test: `tests/lib/format/currency.test.ts`, `tests/lib/cart/cart.test.ts`

**Interfaces:**
- Produces:
  - `type MenuItem = { id: string; categoria: string; nome: string; descricao?: string; preco: number; foto?: string; disponivel: boolean }`
  - `type MenuCategory = { nome: string; itens: MenuItem[] }`; `type Menu = { categorias: MenuCategory[] }`
  - `formatBRL(centavos: number): string` → `"R$ 25,00"` (espaço normal, não NBSP)
  - `type CartState = { lines: { id: string; qty: number }[] }`
  - `type CartAction = { type: 'add'; id: string } | { type: 'decrement'; id: string } | { type: 'remove'; id: string } | { type: 'clear' }`
  - `cartReducer(state: CartState, action: CartAction): CartState`
  - `resolveCart(state: CartState, menu: Menu): { lines: { item: MenuItem; qty: number; total: number }[]; count: number; subtotal: number }` (resolve pelo id no cardápio atual)

- [ ] **Step 1: Testes que falham**
  - `formatBRL(2500) === 'R$ 25,00'`, `formatBRL(5) === 'R$ 0,05'`, `formatBRL(123456) === 'R$ 1.234,56'`
  - `add` duas vezes o mesmo id → uma linha com `qty: 2`; `decrement` em qty 1 → remove a linha; `clear` → `lines: []`
  - `resolveCart` com linha `{id:'x', qty:2}` e item `x` a 2500 → `subtotal 5000, count 2`
  - **Review Focus 4:** `resolveCart` com id inexistente → ignorado; item com `disponivel: false` → ignorado; preço vem do cardápio atual.
- [ ] **Step 2:** `npm test` → FAIL (módulos inexistentes).
- [ ] **Step 3:** Implementar (`Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL'})` trocando ` ` por espaço).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat(cart): adiciona tipos do cardápio, formatação em reais e lógica do carrinho`.

### Task 3: Mensagem e link do WhatsApp

**Files:**
- Create: `src/lib/whatsapp/order.ts`
- Test: `tests/lib/whatsapp/order.test.ts`

**Interfaces:**
- Consumes: `resolveCart` (Task 2), `formatBRL`
- Produces:
  - `type Order = { lines: { item: MenuItem; qty: number; total: number }[]; subtotal: number; tipo: 'entrega' | 'retirada'; nome: string; endereco?: string; pagamento: 'pix' | 'dinheiro' | 'cartao'; trocoPara?: number; observacao?: string }`
  - `buildOrderMessage(order: Order, restaurante: string, opts?: { taxaEntrega?: string }): string`
  - `normalizePhone(raw: string): string` → só dígitos com DDI 55 (`'(11) 94832-5987'` → `'5511948325987'`)
  - `buildWhatsAppUrl(phone: string, text: string): string` → `https://wa.me/<digits>?text=<encodeURIComponent(text)>`

- [ ] **Step 1: Testes que falham** — a mensagem exata da spec §5 para o pedido de exemplo (2x Bife bovino acebolado 2500, 1x Coca-Cola 350 ml 800, entrega "Rua X, 123 — apto 4", Pix, Ana, obs "sem cebola na salada"):
  ```
  *Novo pedido — Tempero Mineiro*
  2x Bife bovino acebolado — R$ 50,00
  1x Coca-Cola 350 ml — R$ 8,00
  *Subtotal: R$ 58,00* (taxa de entrega a combinar)
  Entrega: Rua X, 123 — apto 4
  Pagamento: Pix
  Nome: Ana
  Obs.: sem cebola na salada
  ```
  - Retirada → linha `Retirada no local`, sem "(taxa de entrega a combinar)".
  - Dinheiro com `trocoPara: 10000` → `Pagamento: Dinheiro (troco para R$ 100,00)`; sem troco → `Pagamento: Dinheiro`. Cartão → `Pagamento: Cartão na entrega`.
  - Sem observação → nenhuma linha `Obs.`.
  - `normalizePhone('(11) 94832-5987') === '5511948325987'`; `normalizePhone('+55 11 94832-5987') === '5511948325987'`.
  - **Review Focus 3:** `decodeURIComponent(new URL(buildWhatsAppUrl(p, 'A & B #1\nçã 🍛')).searchParams.get('text'))` devolve o texto original.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat(whatsapp): monta mensagem do pedido e link wa.me`.

### Task 4: Cardápio da planilha com fallback

**Files:**
- Create: `src/lib/menu/csv.ts`, `src/lib/menu/load.ts`, `src/data/cardapio.json` (Cantina Modelo: 3 categorias, 8–10 itens fictícios)
- Test: `tests/lib/menu/csv.test.ts`, `tests/lib/menu/load.test.ts`

**Interfaces:**
- Consumes: tipos da Task 2
- Produces:
  - `parsePrice(raw: string): number` (centavos)
  - `parseMenuCsv(csv: string): Menu` — mantém a ordem das categorias como aparecem; `id` = slug de `categoria + nome`; `disponivel` falso para `não|nao|false|0` (sem diferenciar maiúsculas), verdadeiro para vazio.
  - `loadMenu(): Promise<Menu>` — com `CARDAPIO_SHEET_URL`: `fetch(url, { next: { revalidate: 300 } })` e parse; erro de rede, status ≠ 200 ou cardápio vazio → JSON local. Sem env → JSON local.

- [ ] **Step 1: Testes que falham**
  - **Review Focus 1:** `parsePrice('25,00') === 2500`, `parsePrice('R$ 25,00') === 2500`, `parsePrice('25.5') === 2550`, `parsePrice('1.234,56') === 123456`, `parsePrice('') === 0`.
  - **Review Focus 2:** linha `Pratos do dia,Bife acebolado,"Acompanha arroz, feijão e ""farofa""","25,00",,sim` → descrição `Acompanha arroz, feijão e "farofa"` e preço 2500 (CSV com aspas escapadas e vírgulas internas).
  - Cabeçalho em qualquer caixa; linhas vazias ignoradas; `disponivel=Não` → item com `disponivel: false`.
  - `loadMenu` com `fetch` mockado devolvendo 500 → retorna o JSON local; sem env → JSON local.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar o parser CSV à mão (sem dependência), com estado "dentro de aspas".
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat(menu): lê cardápio da planilha do google com fallback em json`.

### Task 5: Horário de funcionamento

**Files:**
- Create: `src/lib/hours/status.ts`
- Test: `tests/lib/hours/status.test.ts`

**Interfaces:**
- Produces:
  - `type Horario = { dias: number[]; abre: string; fecha: string }` (0 = domingo; `"11:00"`)
  - `getOpenStatus(now: Date, horarios: Horario[], tz?: string): { aberto: boolean; fechaAs?: string; proximaAbertura?: { dia: number; hora: string } }`

- [ ] **Step 1: Testes que falham** (horário: todos os dias, 11:00–15:30; datas em UTC convertidas para SP, UTC−3)
  - `2026-11-26T15:00:00Z` (12:00 em SP) → `{ aberto: true, fechaAs: '15:30' }`
  - `2026-11-26T19:00:00Z` (16:00) → fechado, `proximaAbertura: { dia: 5, hora: '11:00' }` (sexta)
  - `2026-11-26T12:00:00Z` (09:00) → fechado, próxima abertura no mesmo dia (quinta, `dia: 4`)
  - Horário só de seg–sex e agora sábado 12:00 → próxima abertura segunda.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar com `Intl.DateTimeFormat('en-US', { timeZone, weekday, hour, minute, hourCycle: 'h23' })` para obter dia e minuto locais.
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat(hours): calcula aberto ou fechado no fuso de são paulo`.

### Task 6: Configuração do cliente, sistema visual e casca da página

**Files:**
- Create: `src/config/cliente.types.ts`, `src/config/cliente.ts` (Cantina Modelo), `src/components/layout/{Header,Footer,DemoBanner}.tsx` + `.module.css`, `src/app/robots.ts`, `src/app/sitemap.ts`
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `next.config.ts` (`images.remotePatterns` para `lh3.googleusercontent.com` e o host de imagens do WhatsMenu)

**Interfaces:**
- Consumes: `Horario` (Task 5)
- Produces:
  - `type Cliente = { slug: string; nome: string; slogan: string; descricao: string; cores: { bg: string; ink: string; accent: string; surface?: string; muted?: string }; whatsapp: string; telefone?: string; instagram?: string; endereco: { rua: string; complemento?: string; bairro: string; cidade: string; mapsUrl: string }; horarios: Horario[]; horarioTexto: string; pagamentos: ('pix'|'dinheiro'|'cartao')[]; taxaEntrega: string; hero: { foto: string; alt: string }; buffet?: { titulo: string; texto: string; precoKg?: { valor: number; aConfirmar: boolean }; fotos: { src: string; alt: string }[] }; visitaFotos: { src: string; alt: string }[]; logo?: string; creditos: { autor: string; contato?: string } }`
  - `export const cliente: Cliente`
  - `isDemo(): boolean` (lê `NEXT_PUBLIC_DEMO_MODE`)

- [ ] **Step 1:** Rodar o deal da taste-skill para a página "place" (no diretório do projeto): `node $TASTE/scripts/start.mjs deal --page place --trade restaurant --history .taste-skill/history.json`, depois `start.mjs brand --page place --bg/--ink/--accent` com as cores do cliente e o par tipográfico do deal; `moments.mjs pick --page place --count 1 --photo`; ler `references/{copy,copy-voice,system,layout-v4,sections}.md`. Registrar o resultado no comentário do topo do `<body>`.
- [ ] **Step 2:** `layout.tsx`: `lang="pt-BR"`, `data-type="place"`, metas `page-type`, `site-kind`, `page-kind`, title/description/og a partir de `cliente`, `robots` noindex quando `isDemo()`, CSS do kit e scripts de motion de `public/assets`, link de pular para o conteúdo. `:root` com as cores de `cliente.cores`.
- [ ] **Step 3:** `robots.ts` → `Disallow: /` quando demo; `Allow: /` quando não.
- [ ] **Step 4:** Header (logo + nome + botão de carrinho, ainda sem estado), DemoBanner ("Demonstração — proposta de site para {nome}" + "Proposta criada por {creditos.autor}", com link de contato se `creditos.contato` existir), Footer (contatos, Instagram, linha de créditos de foto e autoria).
- [ ] **Step 5:** Verificar: `npm run build` OK; `npm run dev` + `curl -s localhost:3000/robots.txt` → `Disallow: /`; HTML contém `noindex`.
- [ ] **Step 6:** Commit `feat(layout): adiciona configuração do cliente, sistema visual e modo demonstração`.

### Task 7: Seções Hero, Buffet e Visita

**Files:**
- Create: `src/components/sections/{Hero,Buffet,Visit}.tsx` + `.module.css`, `src/components/sections/OpenStatus.tsx` (client component)
- Modify: `src/app/page.tsx`
- Test: `tests/components/OpenStatus.test.tsx`

**Interfaces:**
- Consumes: `cliente`, `getOpenStatus`, `formatBRL`
- Produces: `<Hero />`, `<Buffet />` (não renderiza sem `cliente.buffet`), `<Visit />`; âncoras `#cardapio` e `#visita`.

- [ ] **Step 1:** Teste que falha: `OpenStatus` com relógio fixo às 12:00 de SP mostra "Aberto agora · fecha às 15:30"; às 16:00 mostra "Fechado · abre amanhã às 11:00".
- [ ] **Step 2:** `npm test` → FAIL; implementar `OpenStatus` (calcula no cliente após montar, para não divergir do HTML estático); `npm test` → PASS.
- [ ] **Step 3:** Hero conforme a spec §5.3 (h1 com categoria + lugar, fato concreto, "Pedir marmita" → `#cardapio`, "Como chegar" → `mapsUrl`), `data-enter`, uma tela em 1440x900 e 390x844. Buffet: composição diferente da do cardápio, preço do kg com o selo "valor a confirmar" quando `aConfirmar`. Visit: endereço, horários, `OpenStatus`, botões "Como chegar" e "Ligar" (`tel:`). Textos escritos pelas regras de `copy.md`.
- [ ] **Step 4:** Verificar visualmente com `node $TASTE/scripts/shoot.mjs --url http://localhost:3000 --w 1440 --out shots/1440.png --profile .taste-skill/chrome-check` e em 390.
- [ ] **Step 5:** Commit `feat(sections): adiciona hero, buffet e visita`.

### Task 8: Cardápio, carrinho e checkout

**Files:**
- Create: `src/components/cart/{CartProvider,CartDrawer,CartBar,CheckoutForm}.tsx` + CSS, `src/components/menu/{MenuSection,CategoryChips,ProductCard}.tsx` + CSS, `src/lib/cart/storage.ts`, `src/lib/whatsapp/validate.ts`
- Modify: `src/app/page.tsx` (carrega `loadMenu()` no servidor, `export const revalidate = 300`), `src/components/layout/Header.tsx` (contador)
- Test: `tests/lib/whatsapp/validate.test.ts`, `tests/components/cart-flow.test.tsx`

**Interfaces:**
- Consumes: Tasks 2–5, `cliente`
- Produces:
  - `useCart(): { state: CartState; resolved: ReturnType<typeof resolveCart>; dispatch: (a: CartAction) => void; open: boolean; setOpen: (v: boolean) => void }`
  - `loadCart(): CartState` / `saveCart(s: CartState): void` (chave `cart:<cliente.slug>`; qualquer exceção → estado vazio, sem erro na tela)
  - `validateCheckout(input: CheckoutInput): Record<string, string>` com `type CheckoutInput = { tipo: 'entrega'|'retirada'; nome: string; endereco: string; pagamento: 'pix'|'dinheiro'|'cartao'; troco: string; observacao: string }`

- [ ] **Step 1: Testes que falham**
  - **Review Focus 5:** `validateCheckout({tipo:'entrega', endereco:'', nome:'Ana', ...})` → `{ endereco: 'Informe o endereço de entrega' }`; `nome: ''` → `{ nome: 'Informe seu nome' }`; retirada sem endereço → `{}`; dinheiro com `troco: ''` → `{}`; `troco: 'abc'` → `{ troco: 'Informe um valor, ex.: 100' }`.
  - Fluxo (Testing Library): clicar "+" em um item → contador do header mostra 1 → abrir carrinho → preencher retirada, nome, Pix → "Enviar pedido" chama `window.open` com URL que começa por `https://wa.me/55` e contém o nome do item.
  - `loadCart` com `localStorage.getItem` lançando erro → `{ lines: [] }`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar. Chips fixos no topo da seção (`position: sticky`) que rolam até a categoria e marcam a ativa; card com foto quadrada, nome, descrição, preço e botão "+" (`aria-label="Adicionar {nome}"`), que vira um controle −/qtd/+ quando o item está no carrinho; gaveta lateral ≥ 768px e tela cheia abaixo disso, com foco preso, Esc fecha e o foco volta ao botão; CartBar fixa no rodapé abaixo de 768px quando `count > 0`; aviso de fechado no carrinho usando `getOpenStatus`; erros embaixo de cada campo, com `aria-describedby`.
- [ ] **Step 4:** `npm test && npm run lint && npm run build` → tudo verde.
- [ ] **Step 5:** Teste manual em 390px: montar pedido, conferir a mensagem no link gerado (copiar a URL e decodificar).
- [ ] **Step 6:** Commit `feat(menu): adiciona cardápio, carrinho e envio do pedido pelo whatsapp`.

### Task 9: Revisão de qualidade e documentação do modelo

**Files:**
- Create: `docs/planilha.md`, `docs/novo-cliente.md`, `.taste-skill/waivers.json`
- Modify: o que o gate e a revisão apontarem; `README.md`

- [ ] **Step 1:** Armar e rodar o gate contra o dev server: `node $TASTE/scripts/gate.mjs --start http://localhost:3000/ --kind place --category "restaurante com cardápio e pedido pelo WhatsApp" --primary "Pedir marmita"`; depois `copy-lint`, `consistency.mjs`, `check.mjs` (1440x900, 1024x768, 820x1180, 768x1024, 390x844) e `perf.mjs`, conforme o SKILL.md. Registrar o waiver da regra 9 com o motivo da spec §3.
- [ ] **Step 2:** Corrigir até `GATE: PASS` (no máximo 3 rodadas; o que sobrar vai para o relatório).
- [ ] **Step 3:** Rodar a skill `anthropic-skills:web-design-guidelines` sobre `src/components` e corrigir o que ela apontar (foco, contraste, nomes acessíveis, toque).
- [ ] **Step 4:** Escrever `docs/planilha.md` (modelo de colunas, como publicar em CSV, como colar a URL na Vercel) e `docs/novo-cliente.md` (clonar, `git remote add upstream`, trocar `cliente.ts`, `cardapio.json` e as imagens, criar o projeto na Vercel). README com o que é, como rodar e os comandos.
- [ ] **Step 5:** `npm test && npm run lint && npm run build` → verde. Commit(s) `fix(...)`/`style(...)` por correção e `docs: guia de planilha e de novo cliente`; tag `v0.1.0`.

### Task 10: Publicar o modelo

**Pré-requisito:** repositório vazio `Gabriel707Alves/vitrine-cardapio` criado pelo Gabriel.

- [ ] **Step 1:** dar acesso de push a `Gabriel707Alves/vitrine-cardapio`; `git remote add origin …`; `git push -u origin main --tags`.
- [ ] **Step 2:** Verificar no GitHub (`git ls-remote origin`) que a `main` e a tag estão lá.

### Task 11: Demo do Tempero Mineiro

**Pré-requisito:** repositório vazio `Gabriel707Alves/tempero-mineiro-site`.

**Files (no repo do cliente):**
- Modify: `src/config/cliente.ts`, `src/data/cardapio.json`, `public/images/logo.png`
- Create: `docs/lead.md` (cópia de `leads/tempero-mineiro/lead.md`)

- [ ] **Step 1:** `git clone ~/projetos/vitrine-cardapio ~/projetos/tempero-mineiro-site`; `git remote rename origin upstream` (e apontar `upstream` para o GitHub do modelo); `git remote add origin` do repo do cliente; branch `feat/tempero-mineiro`.
- [ ] **Step 2:** Coletar no navegador as URLs das fotos dos pratos do WhatsMenu do restaurante; recortar o logo de `/mnt/user-data/uploads/40dca033-image.png` (Pillow) para `public/images/logo.png`.
- [ ] **Step 3:** Preencher `cliente.ts` com os dados do lead: nome, WhatsApp `(11) 94832-5987`, telefone `(11) 3277-4692`, endereço R. Galvão Bueno, 351, 2º andar, Galeria Imperial, Liberdade; horário todos os dias 11:00–15:30; cores do logo (vermelho, marrom, dourado, base creme); buffet com `precoKg { valor: 7790, aConfirmar: true }`; fotos do Google Maps (hero = foto 3 ou 7 do lead); `taxaEntrega: 'a combinar pelo WhatsApp'`; créditos "Gabriel Alves". `cardapio.json` com os 11 pratos, 6 adicionais e 8 bebidas do WhatsMenu (nomes em caixa normal e erros de digitação corrigidos; preços em centavos).
- [ ] **Step 4:** `npm test && npm run build`; rodar o gate (mesmo comando da Task 9, `--primary "Pedir marmita"`) até `GATE: PASS`; screenshots 1440 e 390.
- [ ] **Step 5:** Commits `feat(cliente): configura dados do tempero mineiro`, `feat(menu): cardápio de marmitas do tempero mineiro`, `docs: adiciona ficha do lead`; merge `--no-ff` na `main`; `git push -u origin main`.
- [ ] **Step 6:** Vercel: `create_git_project` com `repo: Gabriel707Alves/tempero-mineiro-site`, `teamId: team_9iQvRZJbM0EMS7SKeJl2D1ER`; env `NEXT_PUBLIC_DEMO_MODE=true` em production e preview; aguardar o deploy `READY` (`get_deployment`).
- [ ] **Step 7:** Abrir a URL de produção no navegador em 390 e 1440: faixa demo visível, `noindex` no HTML, pedido de teste montado até o link `wa.me` (sem enviar), fotos carregando. Se o build falhar: `get_deployment` + logs, corrigir com `fix(...)`, novo push.
