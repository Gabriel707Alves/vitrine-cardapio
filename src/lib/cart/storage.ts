import type { CartState } from "./cart";

const key = (slug: string) => `cart:${slug}`;
const EMPTY: CartState = { lines: [] };

function isCartState(v: unknown): v is CartState {
  return (
    typeof v === "object" && v !== null && Array.isArray((v as CartState).lines) &&
    (v as CartState).lines.every((l) => typeof l?.id === "string" && Number.isInteger(l?.qty) && l.qty > 0)
  );
}

/** Carrinho salvo no navegador. Qualquer problema (bloqueado, corrompido) → carrinho vazio. */
export function loadCart(slug: string): CartState {
  try {
    const raw = localStorage.getItem(key(slug));
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return isCartState(parsed) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function saveCart(slug: string, state: CartState): void {
  try {
    localStorage.setItem(key(slug), JSON.stringify(state));
  } catch {
    /* sem armazenamento: o carrinho vale só nesta visita */
  }
}
