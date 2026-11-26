# Design — Vitrine Cardápio (modelo) + Tempero Mineiro (1ª demo)

Data: 2026-11-25 · Autor: Gabriel Alves

## 1. Intenção

Gabriel prospecta restaurantes e lanchonetes por telefone, fora da região dele. O
argumento mais forte numa ligação fria é mandar um link com **o próprio restaurante
já funcionando**: o nome, as fotos, o cardápio e o pedido chegando no WhatsApp.

Para isso existem duas peças:

1. **`vitrine-cardapio`**: um modelo reutilizável de site de restaurante com cardápio
   e pedido pelo WhatsApp. Trocar de cliente é trocar um arquivo de configuração,
   a pasta de imagens e os dados do cardápio.
2. **`tempero-mineiro-site`**: a primeira demo, gerada a partir do modelo para o
   Restaurante Tempero Mineiro (Liberdade, SP).

O Tempero Mineiro já usa o WhatsMenu para as marmitas. A demo, portanto, vende um
**upgrade**: identidade própria, o self-service por quilo e o salão (que o WhatsMenu
não mostra), presença ligada ao Google e nenhuma plataforma genérica no meio.

## 2. Objetivos, não-objetivos, anti-objetivos

**Objetivos**
- Uma demo personalizada sair em menos de 1 hora a partir do modelo.
- O cliente pedir marmitas pelo celular em menos de 1 minuto: escolher, somar,
  preencher entrega e mandar a mensagem pronta no WhatsApp.
- Parecer site de estúdio, não template (protocolo do Gabriel e taste-skill).
- O dono conseguir editar o cardápio sozinho, por uma planilha do Google, quando
  virar cliente.
- Repositórios com histórico limpo (conventional commits) que sirvam de portfólio.

**Não-objetivos (v1)**
- Pagamento online, painel com login, banco de dados.
- Cálculo de taxa de entrega por CEP.
- Gestão de pedidos: o pedido termina no WhatsApp do restaurante.

**Anti-objetivos** (falha mesmo que funcione)
- Parecer o site oficial do restaurante sem autorização.
- Visual de app de delivery genérico (preto + amarelo, cards iguais aos de qualquer marketplace).
- Pedido que chega no WhatsApp bagunçado ou com valor errado.
- Página lenta ou quebrada no celular (o celular é onde o pedido acontece).

## 3. Restrições

- **Vercel Hobby = uso não comercial.** Demos podem ficar na conta do Gabriel. Quando
  um cliente pagar, o repositório e o projeto vão para a conta do cliente (ou o
  Gabriel passa para o plano Pro).
- **Modo demonstração obrigatório** enquanto não houver autorização: uma faixa fixa
  ("Demonstração — proposta de site para o Tempero Mineiro"), `noindex` e
  `robots.txt` bloqueando tudo. Ligado por `NEXT_PUBLIC_DEMO_MODE=true`.
- **GitHub:** o `gh` desta sessão não tem token válido, então eu não consigo criar
  repositórios. O Gabriel cria os dois vazios (sem README) e eu anexo com permissão de push.
  Sem token também não consigo abrir pull requests: as branches de feature são
  mescladas com `--no-ff` e enviadas.
- **Imagens:** o ambiente não baixa do Google. As fotos ficam por URL remota
  (`next/image` com `remotePatterns`). O logo sai recortado do print do Instagram
  enviado pelo Gabriel, com resolução baixa: fica pequeno no header até o dono mandar o original.
- **Fotos de clientes do Google:** valem só para a demo particular. O site final usa
  as fotos do restaurante.

### Onde o projeto diverge da taste-skill, e por quê
- **Regra 9 (endereço sem número, telefone falso, contatos `.example`):** a regra
  existe para páginas de exemplo. Aqui os dados são públicos e do próprio
  estabelecimento, e o pedido precisa do WhatsApp real. Mantenho endereço completo
  e WhatsApp real, protegidos pelo modo demonstração. Vai como waiver no gate.
- **Referência do Gabriel (app escuro preto/amarelo):** a skill proíbe fundo escuro
  em site de "place". Aproveito só a estrutura de uso (chips de categoria, card com
  botão +, carrinho sempre visível, faixa de oferta), não a paleta.

## 4. Abordagens consideradas

| | Abordagem | Prós | Contras |
|---|---|---|---|
| **1 ✅** | **Repo modelo + um repo por cliente** | Entrega simples: transfere repo e projeto Vercel para o cliente; cada cliente isolado | Melhorias do modelo precisam ser puxadas para cada cliente |
| 2 | Monorepo com todos os clientes | Melhorias valem para todos na hora | Separar um cliente na entrega é complicado; um erro afeta todos |
| 3 | HTML/CSS/JS puro copiando pasta | O mais simples | Duplicação, sem atualização pela planilha, pouco peso no portfólio |

**Escolhida pelo Gabriel: 1.** Ajuste meu para reduzir o contra: o repo do cliente
não é criado pelo botão "template" do GitHub (que apaga o histórico). Ele é um clone
do modelo com o remoto `upstream` apontando para `vitrine-cardapio`, então uma
melhoria no modelo chega a um cliente com `git pull upstream main`.

## 5. Decisões de como construir

### Stack
- **Next.js (App Router) + TypeScript**, Node 22+, npm.
- **CSS:** tokens e componentes do kit da taste-skill (`system.css` + camada de
  motion) em `public/assets`, com CSS Modules para os componentes do cardápio.
  Sem Tailwind, para não ter dois sistemas de estilo.
- **Testes:** Vitest para a lógica (carrinho, mensagem do WhatsApp, leitura da
  planilha, horário de funcionamento), escritos antes do código (TDD).
- **Deploy:** um projeto Vercel por repositório, ligado ao GitHub (push na `main` =
  produção, branch = preview).

### Dados
- `src/config/cliente.ts`: nome, slogan, cores da marca, WhatsApp, telefone,
  endereço, horários, formas de pagamento, links, fotos, textos das seções.
- **Cardápio:** se `CARDAPIO_SHEET_URL` existir (CSV publicado de uma planilha do
  Google), o site lê dela com revalidação a cada 5 minutos (ISR). Se não existir ou
  falhar, usa `src/data/cardapio.json`. A demo usa o JSON, e a planilha é ligada
  quando o restaurante fecha.
- Colunas da planilha: `categoria, nome, descricao, preco, foto, disponivel`.
  `disponivel = não` esconde o item (o "esgotou" do dono).
- Um modelo da planilha e o passo a passo para o dono ficam em `docs/planilha.md`.

### Página (tipo "place", uma página só)
1. **Faixa de demonstração** (só no modo demo).
2. **Header:** logo + nome; à direita, botão do carrinho com contador.
3. **Hero (1 tela):** foto grande da comida, h1 com o que é e onde ("Comida mineira
   caseira na Liberdade"), um fato concreto (todos os dias, 11h às 15h30), a ação
   principal **"Pedir marmita"** (rola até o cardápio) e a secundária "Como chegar".
4. **Cardápio (pedido):** chips de categoria fixos ao rolar (Pratos do dia,
   Adicionais, Bebidas); cards com foto, nome, descrição, preço e botão **+**; o
   card mostra a quantidade quando o item está no carrinho.
5. **Carrinho:** gaveta lateral no desktop e tela cheia no celular. Itens com +/−,
   subtotal, **entrega ou retirada**, nome, endereço (só para entrega), forma de
   pagamento (Pix, dinheiro com troco, cartão na entrega), observação. "Enviar
   pedido" abre `wa.me/<número>?text=` com a mensagem formatada:
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
   O carrinho fica salvo no `localStorage` (com try/catch). No celular há uma barra
   fixa no rodapé: "Ver carrinho · 3 itens · R$ 58,00".
6. **O buffet por quilo:** o que o WhatsMenu não mostra. Fotos do buffet e das
   saladas, o preço do quilo marcado como "a confirmar" e o café/chá de cortesia.
7. **Visita:** endereço (Galeria Imperial, 2º andar), horários, status
   "aberto agora / fechado · abre às 11h" calculado no fuso de São Paulo, botões
   "Como chegar" (Google Maps) e "Ligar".
8. **Rodapé:** contatos, Instagram e uma linha de crédito ("Site por Gabriel Alves").

Fora do horário, o pedido não é bloqueado: o carrinho avisa "Estamos fechados
agora, seu pedido será visto quando abrirmos às 11h".

### Direção visual
- Base clara e quente (creme), tinta marrom-escura, **vermelho da panela do logo**
  como acento e dourado só em detalhes. A paleta sai do `start.mjs brand` com as
  cores do logo, e o par tipográfico do deal da skill.
- Fotos grandes e quadradas, cantos retos, um estilo de botão, hover com o card
  subindo 2px e a foto com zoom de 1.02, entrada do hero uma vez, 1–2 momentos
  dealt (foto ou tipografia), sem efeitos, sombras pesadas ou gradientes.
- Mobile first: 390px é a largura principal; testar em 320, 768, 1024 e 1440.

### Estrutura de pastas (modelo)
```
vitrine-cardapio/
├─ src/
│  ├─ app/            layout.tsx, page.tsx, robots.ts, sitemap.ts, globals.css
│  ├─ components/
│  │  ├─ layout/      Header, Footer, DemoBanner
│  │  ├─ sections/    Hero, Menu, Buffet, Visit
│  │  ├─ menu/        CategoryChips, ProductCard
│  │  └─ cart/        CartProvider, CartDrawer, CartBar, CheckoutForm
│  ├─ lib/
│  │  ├─ cart/        reducer + tipos (testados)
│  │  ├─ whatsapp/    montagem da mensagem e do link (testado)
│  │  ├─ menu/        leitura de planilha CSV + fallback JSON (testado)
│  │  ├─ hours/       aberto/fechado no fuso America/Sao_Paulo (testado)
│  │  └─ format/      moeda BRL
│  ├─ config/         cliente.ts (+ tipos em cliente.types.ts)
│  └─ data/           cardapio.json
├─ public/            assets/ (kit), images/ (logo)
├─ tests/             espelha src/lib
├─ docs/              superpowers/specs, superpowers/plans, planilha.md, novo-cliente.md
└─ README.md          o que é, como rodar, como criar um cliente novo
```

### Git
- Conventional commits em português no corpo, com tipo e escopo em inglês:
  `feat(cart): adiciona gaveta do carrinho`, `fix(whatsapp): corrige total com adicionais`,
  `style(hero): ajusta espaçamento no mobile`, `docs: guia de novo cliente`,
  `chore: configura vitest`, `test(hours): casos de feriado`.
- `main` sempre publicável; trabalho em `feat/*`, `fix/*`; merge `--no-ff`.
- Tag `v1.0.0` no modelo quando a primeira demo for aprovada.

### Verificação antes de dizer "pronto"
- `npm run test`, `npm run lint`, `npm run build` passando.
- Gate da taste-skill contra o servidor local (copy-lint, consistency, check de
  layout em 1440/1024/820/768/390, perf), com o waiver da regra 9 registrado.
- Revisão com Web Design Guidelines (acessibilidade, foco, contraste, toque ≥ 44px).
- Teste manual do fluxo de pedido no celular (390px): montar o pedido, conferir a
  mensagem gerada e o link `wa.me`.
- Deploy de preview na Vercel aberto e conferido antes de mandar o link ao Gabriel.

## 6. Dados do Tempero Mineiro
Fonte: `leads/tempero-mineiro/lead.md` (Google Maps, Instagram @temperomineirosp e
WhatsMenu). Cardápio de entrega: 11 pratos do dia (R$ 23–30), 6 adicionais e 8 bebidas.

## 7. Decisões que tomei (o Gabriel pode mudar)
- **WhatsApp de pedidos:** (11) 94832-5987, o número do WhatsMenu, porque é para
  onde os pedidos vão hoje. O Google mostra (11) 99432-5687. Confirmar na ligação.
- **Taxa de entrega:** "a combinar pelo WhatsApp" (o valor não está público).
- **Preço do quilo (R$ 77,90):** aparece com a marca "valor a confirmar", porque
  vem de uma avaliação de cliente e não do restaurante.
- **Fotos dos pratos:** as do próprio WhatsMenu do restaurante, quando existirem
  (são do restaurante). As do buffet vêm do Google Maps.
- **Logo:** recorte do print do Instagram.
- **O que o modelo traz de dados:** um restaurante claramente fictício ("Cantina
  Modelo") com cardápio de exemplo, para o modelo rodar sozinho e servir de base. Os
  dados reais de cada cliente só existem no repo daquele cliente (o lead vai para
  `docs/lead.md` dele).

## 8. Fica a critério de quem constrói
Nomes internos, a divisão fina de componentes, as animações dentro do que a skill
permite e o texto final dos parágrafos (seguindo o copy da skill).
