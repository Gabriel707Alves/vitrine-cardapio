import type { Cliente } from "./cliente.types";

/**
 * Dados do restaurante. Este arquivo é o único que muda de um cliente para outro
 * (junto com src/data/cardapio.json e public/images). Ver docs/novo-cliente.md.
 *
 * Cantina Modelo é FICTÍCIA: serve só para o modelo rodar sozinho.
 */
export const cliente: Cliente = {
  slug: "cantina-modelo",
  nome: "Cantina Modelo",
  slogan: "Comida caseira com pedido pelo WhatsApp",
  descricao:
    "Restaurante de comida caseira com marmitas do dia, buffet no almoço e pedido direto pelo WhatsApp.",
  // Paleta flour-terracotta (deal da taste-skill para restaurante).
  cores: {
    bg: "#f6f1e7",
    surface: "#ebe3d4",
    ink: "#2b241e",
    muted: "#6a5f54",
    accent: "#a3472b",
    accentInk: "#ffffff",
    invBg: "#2b241e",
    invSurface: "#37302a",
    invInk: "#f6f1e7",
    invMuted: "#a29c94",
  },
  marca: { tipo: "mark", mark: "stack" },
  whatsapp: "(11) 90000-0000",
  endereco: {
    rua: "Rua Exemplo, 100",
    bairro: "Centro",
    cidade: "São Paulo",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Centro%2C%20S%C3%A3o%20Paulo",
  },
  horarios: [{ dias: [1, 2, 3, 4, 5, 6], abre: "11:00", fecha: "15:00" }],
  horarioTexto: [
    { dias: "Segunda a sábado", horas: "11:00 às 15:00", data: "mon-sat" },
    { dias: "Domingo", horas: "Fechado", data: "sun" },
  ],
  horarioConfirmado: false,
  pagamentos: ["pix", "dinheiro", "cartao"],
  taxaEntrega: "taxa de entrega a combinar",
  textos: {
    heroTitulo: "Comida caseira no Centro",
    heroLead: "Marmita do dia a partir de R$ 21, pedida pelo WhatsApp e pronta em 30 minutos.",
    cardapioTitulo: "Marmitas de hoje",
    cardapioLinha: "Monte o pedido e envie pelo WhatsApp.",
    visitaTitulo: "Endereço e horário",
    buffetTitulo: "Buffet por quilo",
    buffetLinha: "Pago por quilo, servido das 11h às 15h.",
    declaracao: {
      rotulo: "A cozinha",
      texto:
        "Tudo sai da panela na mesma manhã: arroz soltinho, feijão temperado na hora e uma carne diferente a cada dia. O que acaba, acaba, e amanhã tem de novo.",
      destaque: "na mesma manhã",
    },
    fechamentoTitulo: "Bateu a fome?",
    fechamentoLinha: "Peça agora e retire no balcão ou receba em casa.",
  },
  fotos: {
    hero: { src: "/images/exemplo/hero.jpg", alt: "Prato feito com arroz, feijão, carne e salada sobre uma mesa de madeira" },
    visita: { src: "/images/exemplo/visita.jpg", alt: "Mesa do salão com um prato servido" },
    cardapio: [
      { src: "/images/exemplo/cardapio-1.jpg", alt: "Marmita com frango e legumes" },
      { src: "/images/exemplo/cardapio-2.jpg", alt: "Marmita com carne de panela" },
    ],
    buffet: { src: "/images/exemplo/buffet.jpg", alt: "Balcão do buffet com travessas de comida quente" },
    fechamento: { src: "/images/exemplo/fechamento.jpg", alt: "Prato do dia visto de cima" },
  },
  precoKg: { valor: 6990, aConfirmar: true },
  autor: { nome: "Gabriel Alves" },
};
