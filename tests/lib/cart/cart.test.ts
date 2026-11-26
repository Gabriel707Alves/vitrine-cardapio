import { describe, expect, it } from "vitest";
import { cartReducer, resolveCart, type CartState } from "@/lib/cart/cart";
import type { Menu, MenuItem } from "@/lib/menu/types";

const item = (id: string, preco: number, disponivel = true): MenuItem => ({
  id,
  categoria: "Pratos",
  nome: `Item ${id}`,
  preco,
  disponivel,
});

const menu: Menu = {
  categorias: [{ nome: "Pratos", itens: [item("x", 2500), item("y", 800), item("off", 900, false)] }],
};

const empty: CartState = { lines: [] };

describe("cartReducer", () => {
  it("soma a quantidade ao adicionar o mesmo item duas vezes", () => {
    const s = cartReducer(cartReducer(empty, { type: "add", id: "x" }), { type: "add", id: "x" });
    expect(s.lines).toEqual([{ id: "x", qty: 2 }]);
  });
  it("remove a linha ao decrementar a última unidade", () => {
    const s = cartReducer({ lines: [{ id: "x", qty: 1 }] }, { type: "decrement", id: "x" });
    expect(s.lines).toEqual([]);
  });
  it("decrementa sem remover quando há mais de uma unidade", () => {
    const s = cartReducer({ lines: [{ id: "x", qty: 3 }] }, { type: "decrement", id: "x" });
    expect(s.lines).toEqual([{ id: "x", qty: 2 }]);
  });
  it("remove a linha inteira com remove", () => {
    const s = cartReducer({ lines: [{ id: "x", qty: 3 }, { id: "y", qty: 1 }] }, { type: "remove", id: "x" });
    expect(s.lines).toEqual([{ id: "y", qty: 1 }]);
  });
  it("esvazia com clear", () => {
    expect(cartReducer({ lines: [{ id: "x", qty: 3 }] }, { type: "clear" })).toEqual({ lines: [] });
  });
});

describe("resolveCart", () => {
  it("calcula total, quantidade e subtotal pelo cardápio", () => {
    const r = resolveCart({ lines: [{ id: "x", qty: 2 }, { id: "y", qty: 1 }] }, menu);
    expect(r.count).toBe(3);
    expect(r.subtotal).toBe(5800);
    expect(r.lines[0]).toMatchObject({ qty: 2, total: 5000 });
    expect(r.lines[0].item.id).toBe("x");
  });
  it("ignora item que não existe mais no cardápio", () => {
    const r = resolveCart({ lines: [{ id: "sumiu", qty: 2 }, { id: "y", qty: 1 }] }, menu);
    expect(r.lines.map((l) => l.item.id)).toEqual(["y"]);
    expect(r.subtotal).toBe(800);
  });
  it("ignora item indisponível", () => {
    const r = resolveCart({ lines: [{ id: "off", qty: 1 }] }, menu);
    expect(r).toEqual({ lines: [], count: 0, subtotal: 0 });
  });
  it("usa o preço atual do cardápio", () => {
    const novo: Menu = { categorias: [{ nome: "Pratos", itens: [item("x", 3000)] }] };
    expect(resolveCart({ lines: [{ id: "x", qty: 1 }] }, novo).subtotal).toBe(3000);
  });
});
