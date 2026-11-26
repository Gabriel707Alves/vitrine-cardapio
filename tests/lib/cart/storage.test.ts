import { afterEach, describe, expect, it, vi } from "vitest";
import { loadCart, saveCart } from "@/lib/cart/storage";

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

describe("storage do carrinho", () => {
  it("salva e lê o carrinho por restaurante", () => {
    saveCart("loja", { lines: [{ id: "x", qty: 2 }] });
    expect(loadCart("loja")).toEqual({ lines: [{ id: "x", qty: 2 }] });
    expect(loadCart("outra")).toEqual({ lines: [] });
  });
  it("devolve carrinho vazio quando o localStorage lança erro", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("bloqueado"); });
    expect(loadCart("loja")).toEqual({ lines: [] });
  });
  it("devolve carrinho vazio quando o conteúdo salvo é inválido", () => {
    localStorage.setItem("cart:loja", "{lixo");
    expect(loadCart("loja")).toEqual({ lines: [] });
    localStorage.setItem("cart:loja", JSON.stringify({ lines: [{ id: 1, qty: "a" }] }));
    expect(loadCart("loja")).toEqual({ lines: [] });
  });
  it("não quebra quando salvar lança erro", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("cheio"); });
    expect(() => saveCart("loja", { lines: [] })).not.toThrow();
  });
});
