"use client";

import { formatBRL } from "@/lib/format/currency";
import { useCart } from "./CartProvider";

/** Barra fixa do celular (nav.actionbar do kit): "Pedir marmita" ou o resumo do carrinho. */
export function ActionBar() {
  const { resolved, setOpen } = useCart();
  return (
    <nav className="actionbar" aria-label="Ações rápidas">
      {resolved.count > 0 ? (
        <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
          Ver pedido · {resolved.count} {resolved.count === 1 ? "item" : "itens"} · {formatBRL(resolved.subtotal)}
        </button>
      ) : (
        <a className="btn btn--primary" href="#cardapio">
          Pedir marmita
        </a>
      )}
    </nav>
  );
}
