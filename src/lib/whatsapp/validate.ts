import { parsePrice } from "@/lib/menu/csv";
import type { Order, Pagamento } from "./order";

export type CheckoutInput = {
  tipo: "entrega" | "retirada";
  nome: string;
  endereco: string;
  pagamento: Pagamento;
  troco: string;
  observacao: string;
};

export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;

/** Erros por campo, na ordem do formulário. Objeto vazio = pode enviar. */
export function validateCheckout(input: CheckoutInput): CheckoutErrors {
  const errors: CheckoutErrors = {};
  if (!input.nome.trim()) errors.nome = "Informe seu nome";
  if (input.tipo === "entrega" && !input.endereco.trim()) errors.endereco = "Informe o endereço de entrega";
  if (input.pagamento === "dinheiro" && input.troco.trim() && parsePrice(input.troco) <= 0) {
    errors.troco = "Informe um valor, ex.: 100";
  }
  return errors;
}

/** Converte o formulário nos campos do pedido (troco em centavos; endereço só na entrega). */
export function toOrderFields(input: CheckoutInput): Omit<Order, "lines" | "subtotal"> {
  const troco = input.pagamento === "dinheiro" ? parsePrice(input.troco) : 0;
  return {
    tipo: input.tipo,
    nome: input.nome.trim(),
    endereco: input.tipo === "entrega" ? input.endereco.trim() : undefined,
    pagamento: input.pagamento,
    trocoPara: troco > 0 ? troco : undefined,
    observacao: input.observacao.trim() || undefined,
  };
}
