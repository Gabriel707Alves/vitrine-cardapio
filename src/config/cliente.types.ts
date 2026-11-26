import type { Horario } from "@/lib/hours/status";
import type { Pagamento } from "@/lib/whatsapp/order";

export type Foto = { src: string; alt: string; /** object-position, ex.: "50% 40%" */ pos?: string };

export type Cliente = {
  slug: string;
  nome: string;
  /** Uma linha: o que é e onde. Vai no <title> e na descrição. */
  slogan: string;
  descricao: string;
  /** Tokens da paleta (start.mjs da taste-skill). */
  cores: {
    bg: string; surface: string; ink: string; muted: string;
    accent: string; accentInk: string;
    invBg: string; invSurface: string; invInk: string; invMuted: string;
  };
  marca: { tipo: "logo"; src: string; alt: string } | { tipo: "mark"; mark: "dots" | "arc" | "ring" | "petal" | "leaf" | "stack" };
  whatsapp: string;
  telefone?: string;
  instagram?: string;
  endereco: { rua: string; complemento?: string; bairro: string; cidade: string; mapsUrl: string };
  horarios: Horario[];
  /** Linhas de horário para exibir, ex.: [{ dias: "Todos os dias", horas: "11:00 às 15:30", data: "mon-sun" }] */
  horarioTexto: { dias: string; horas: string; data: string }[];
  /** true quando o horário veio do próprio restaurante (habilita "aberto agora"). */
  horarioConfirmado: boolean;
  pagamentos: Pagamento[];
  taxaEntrega: string;
  textos: {
    heroTitulo: string;
    heroLead: string;
    cardapioTitulo: string;
    cardapioLinha: string;
    visitaTitulo: string;
    buffetTitulo: string;
    buffetLinha: string;
    declaracao: { rotulo: string; texto: string; destaque: string };
    fechamentoTitulo: string;
    fechamentoLinha: string;
  };
  fotos: {
    hero: Foto;
    visita: Foto;
    cardapio: [Foto, Foto];
    buffet: Foto;
    fechamento: Foto;
  };
  precoKg?: { valor: number; aConfirmar: boolean };
  creditosFotos?: string;
  autor: { nome: string; contato?: string };
};
