import type { Menu, MenuItem } from "@/lib/menu/types";

export type CartLine = { id: string; qty: number };
export type CartState = { lines: CartLine[] };

export type CartAction =
  | { type: "add"; id: string }
  | { type: "decrement"; id: string }
  | { type: "remove"; id: string }
  | { type: "clear" };

export type ResolvedLine = { item: MenuItem; qty: number; total: number };
export type ResolvedCart = { lines: ResolvedLine[]; count: number; subtotal: number };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const exists = state.lines.some((l) => l.id === action.id);
      return {
        lines: exists
          ? state.lines.map((l) => (l.id === action.id ? { ...l, qty: l.qty + 1 } : l))
          : [...state.lines, { id: action.id, qty: 1 }],
      };
    }
    case "decrement":
      return {
        lines: state.lines
          .map((l) => (l.id === action.id ? { ...l, qty: l.qty - 1 } : l))
          .filter((l) => l.qty > 0),
      };
    case "remove":
      return { lines: state.lines.filter((l) => l.id !== action.id) };
    case "clear":
      return { lines: [] };
  }
}

/** Resolve as linhas do carrinho contra o cardápio atual (preço atual; some o que saiu ou está indisponível). */
export function resolveCart(state: CartState, menu: Menu): ResolvedCart {
  const byId = new Map<string, MenuItem>();
  for (const cat of menu.categorias) for (const it of cat.itens) byId.set(it.id, it);

  const lines: ResolvedLine[] = [];
  for (const { id, qty } of state.lines) {
    const item = byId.get(id);
    if (!item || !item.disponivel || qty <= 0) continue;
    lines.push({ item, qty, total: item.preco * qty });
  }
  return {
    lines,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.total, 0),
  };
}
