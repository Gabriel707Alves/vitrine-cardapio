"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import { cartReducer, resolveCart, type CartAction, type CartState, type ResolvedCart } from "@/lib/cart/cart";
import { loadCart, saveCart } from "@/lib/cart/storage";
import type { Menu } from "@/lib/menu/types";

type CartContext = {
  state: CartState;
  resolved: ResolvedCart;
  dispatch: (a: CartAction) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  qtyOf: (id: string) => number;
};

const Ctx = createContext<CartContext | null>(null);

export function CartProvider({ menu, slug, children }: { menu: Menu; slug: string; children: ReactNode }) {
  const [state, dispatch] = useReducer(
    (s: CartState, a: CartAction | { type: "hydrate"; state: CartState }) => (a.type === "hydrate" ? a.state : cartReducer(s, a)),
    { lines: [] },
  );
  const [open, setOpen] = useState(false);
  const hydrated = useRef(false);

  // Lê o carrinho salvo só no navegador, depois de montar (o HTML estático vem vazio).
  useEffect(() => {
    dispatch({ type: "hydrate", state: loadCart(slug) });
    hydrated.current = true;
  }, [slug]);

  useEffect(() => {
    if (hydrated.current) saveCart(slug, state);
  }, [slug, state]);

  const value = useMemo<CartContext>(() => {
    const resolved = resolveCart(state, menu);
    return {
      state,
      resolved,
      dispatch,
      open,
      setOpen,
      qtyOf: (id) => resolved.lines.find((l) => l.item.id === id)?.qty ?? 0,
    };
  }, [state, menu, open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
