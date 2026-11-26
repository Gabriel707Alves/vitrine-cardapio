# Cardápio pela planilha do Google

O dono do restaurante edita o cardápio numa planilha do Google, pelo celular. O site relê a
planilha a cada 5 minutos. Se a planilha falhar, o site mostra o cardápio de `src/data/cardapio.json`.

## 1. Criar a planilha

Uma aba com estas colunas, nesta ordem, na primeira linha:

| categoria | nome | descricao | preco | foto | disponivel |
|---|---|---|---|---|---|
| Pratos do dia | Bife acebolado | Acompanha arroz, feijão, farofa e salada. | 25,00 | | sim |
| Pratos do dia | Feijoada | Acompanha couve, farofa e laranja. | 28,00 | https://…/feijoada.jpg | sim |
| Bebidas | Coca-Cola 350 ml | | 8,00 | | não |

- **categoria:** as categorias aparecem no site na ordem em que surgem na planilha.
- **preco:** pode escrever `25,00`, `R$ 25,00` ou `25`. Use vírgula para os centavos.
- **foto:** link direto de uma imagem (opcional).
- **disponivel:** `não` esconde o item do site (o "acabou"). Vazio ou `sim` mostra.
- Vírgulas dentro da descrição não quebram nada.

## 2. Publicar como CSV

1. Na planilha: **Arquivo → Compartilhar → Publicar na Web**.
2. Escolha a aba do cardápio e o formato **Valores separados por vírgula (.csv)**.
3. Clique em **Publicar** e copie o link (termina com `output=csv`).

## 3. Ligar no site

1. Na Vercel, abra o projeto → **Settings → Environment Variables**.
2. Crie `CARDAPIO_SHEET_URL` com o link copiado (Production e Preview).
3. Faça um novo deploy (**Deployments → … → Redeploy**).

Daí em diante, o que o dono mudar na planilha aparece no site em até 5 minutos.
