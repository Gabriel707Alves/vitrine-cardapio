"use client";

import { useCart } from "./CartProvider";

/** Botão do carrinho no cabeçalho, com o número de itens. */
export function CartButton() {
  const { resolved, setOpen } = useCart();
  const n = resolved.count;
  return (
    <button
      type="button"
      className="btn btn--secondary cart-button"
      aria-label={n ? `Abrir carrinho, ${n} ${n === 1 ? "item" : "itens"}` : "Abrir carrinho"}
      onClick={() => setOpen(true)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      <span className="cart-button__count" aria-hidden="true">{n}</span>
    </button>
  );
}
