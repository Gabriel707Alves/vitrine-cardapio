import { formatBRL } from "@/lib/format/currency";
import type { ResolvedLine } from "@/lib/cart/cart";

export type Pagamento = "pix" | "dinheiro" | "cartao";

export type Order = {
  lines: ResolvedLine[];
  subtotal: number;
  tipo: "entrega" | "retirada";
  nome: string;
  endereco?: string;
  pagamento: Pagamento;
  /** Valor em centavos para o qual o cliente precisa de troco. */
  trocoPara?: number;
  observacao?: string;
};

const PAGAMENTO_LABEL: Record<Pagamento, string> = {
  pix: "Pix",
  dinheiro: "Dinheiro",
  cartao: "Cartão na entrega",
};

/** Texto do pedido como chega no WhatsApp do restaurante (negrito com *, uma informação por linha). */
export function buildOrderMessage(
  order: Order,
  restaurante: string,
  opts: { taxaEntrega?: string } = {},
): string {
  const taxa = opts.taxaEntrega ?? "taxa de entrega a combinar";
  const out = [`*Novo pedido — ${restaurante}*`];

  for (const l of order.lines) out.push(`${l.qty}x ${l.item.nome} — ${formatBRL(l.total)}`);

  const subtotal = `*Subtotal: ${formatBRL(order.subtotal)}*`;
  if (order.tipo === "entrega") {
    out.push(`${subtotal} (${taxa})`);
    out.push(`Entrega: ${order.endereco?.trim() ?? ""}`);
  } else {
    out.push(subtotal);
    out.push("Retirada no local");
  }

  let pagamento = PAGAMENTO_LABEL[order.pagamento];
  if (order.pagamento === "dinheiro" && order.trocoPara) pagamento += ` (troco para ${formatBRL(order.trocoPara)})`;
  out.push(`Pagamento: ${pagamento}`);
  out.push(`Nome: ${order.nome.trim()}`);

  const obs = order.observacao?.trim();
  if (obs) out.push(`Obs.: ${obs}`);

  return out.join("\n");
}

/** Só dígitos, com DDI 55: "(11) 94832-5987" → "5511948325987". */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.startsWith("55") && digits.length >= 12 ? digits : `55${digits}`;
}

export function buildWhatsAppUrl(phone: string, text: string): string {
  return `https://wa.me/${normalizePhone(phone)}?text=${encodeURIComponent(text)}`;
}
