# Criar a demo de um cliente novo

Cada cliente é um **clone** deste repositório. O remoto `upstream` aponta para o modelo, para
trazer melhorias depois.

## 1. Criar o repositório do cliente

No GitHub, crie um repositório **privado e vazio** (sem README), por exemplo `nome-do-restaurante-site`.

```bash
git clone https://github.com/Gabriel707Alves/vitrine-cardapio.git nome-do-restaurante-site
cd nome-do-restaurante-site
git remote rename origin upstream
git remote add origin https://github.com/Gabriel707Alves/nome-do-restaurante-site.git
git checkout -b feat/nome-do-restaurante
```

## 2. Trocar os dados

| Arquivo | O que muda |
|---|---|
| `src/config/cliente.ts` | nome, cores, WhatsApp, endereço, horários, textos e fotos |
| `src/data/cardapio.json` | cardápio (preços em centavos: R$ 25,00 = `2500`) |
| `public/images/` | logo e fotos locais (apague `exemplo/`) |
| `docs/lead.md` | ficha do lead: de onde vieram os dados e o que confirmar na ligação |

- **Cores:** rode o deal da taste-skill (`start.mjs deal --page place --trade restaurant`) ou use as cores do logo (`start.mjs brand`).
- **Horário:** `horarioConfirmado: true` só quando o horário veio do próprio restaurante (Instagram, Google do dono). É isso que liga o "aberto agora".
- **Fotos remotas:** domínios novos de imagem precisam entrar em `images.remotePatterns` no `next.config.ts`.

## 3. Conferir

```bash
npm install
npm test && npm run lint && npm run build
```

## 4. Publicar a demo

```bash
git push -u origin main
```

Na Vercel: **Add New → Project**, importe o repositório e crie a variável
`NEXT_PUBLIC_DEMO_MODE=true` (faixa de demonstração + fora do Google).

## 5. Quando o cliente fechar

1. `NEXT_PUBLIC_DEMO_MODE=false` (ou apague a variável) e novo deploy.
2. Ligue a planilha (`docs/planilha.md`).
3. Transfira o repositório (GitHub → Settings → Transfer) e o projeto da Vercel para a conta do cliente, ou passe a conta para o plano Pro: o plano Hobby não permite uso comercial.

## Trazer melhorias do modelo

```bash
git fetch upstream
git merge upstream/main
```
