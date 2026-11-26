const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos como moeda brasileira: 2500 → "R$ 25,00". */
export function formatBRL(centavos: number): string {
  return brl.format(centavos / 100).replace(/ /g, " ");
}
