import { describe, expect, it } from "vitest";
import { buildOrderMessage, buildWhatsAppUrl, normalizePhone, type Order } from "@/lib/whatsapp/order";
import type { MenuItem } from "@/lib/menu/types";

const bife: MenuItem = { id: "bife", categoria: "Pratos do dia", nome: "Bife bovino acebolado", preco: 2500, disponivel: true };
const coca: MenuItem = { id: "coca", categoria: "Bebidas", nome: "Coca-Cola 350 ml", preco: 800, disponivel: true };

const base: Order = {
  lines: [
    { item: bife, qty: 2, total: 5000 },
    { item: coca, qty: 1, total: 800 },
  ],
  subtotal: 5800,
  tipo: "entrega",
  nome: "Ana",
  endereco: "Rua X, 123 — apto 4",
  pagamento: "pix",
  observacao: "sem cebola na salada",
};

describe("buildOrderMessage", () => {
  it("monta a mensagem exata da spec para entrega com Pix", () => {
    expect(buildOrderMessage(base, "Tempero Mineiro")).toBe(
      [
        "*Novo pedido — Tempero Mineiro*",
        "2x Bife bovino acebolado — R$ 50,00",
        "1x Coca-Cola 350 ml — R$ 8,00",
        "*Subtotal: R$ 58,00* (taxa de entrega a combinar)",
        "Entrega: Rua X, 123 — apto 4",
        "Pagamento: Pix",
        "Nome: Ana",
        "Obs.: sem cebola na salada",
      ].join("\n"),
    );
  });

  it("na retirada não menciona taxa e indica retirada no local", () => {
    const msg = buildOrderMessage({ ...base, tipo: "retirada", endereco: undefined }, "Tempero Mineiro");
    expect(msg).toContain("*Subtotal: R$ 58,00*\n");
    expect(msg).not.toContain("taxa de entrega");
    expect(msg).toContain("Retirada no local");
    expect(msg).not.toContain("Entrega:");
  });

  it("mostra o troco quando o pagamento é em dinheiro", () => {
    const msg = buildOrderMessage({ ...base, pagamento: "dinheiro", trocoPara: 10000 }, "X");
    expect(msg).toContain("Pagamento: Dinheiro (troco para R$ 100,00)");
  });

  it("dinheiro sem troco não menciona troco", () => {
    expect(buildOrderMessage({ ...base, pagamento: "dinheiro" }, "X")).toContain("Pagamento: Dinheiro\n");
  });

  it("cartão aparece como cartão na entrega", () => {
    expect(buildOrderMessage({ ...base, pagamento: "cartao" }, "X")).toContain("Pagamento: Cartão na entrega");
  });

  it("omite a linha de observação quando vazia", () => {
    expect(buildOrderMessage({ ...base, observacao: "  " }, "X")).not.toContain("Obs.");
  });

  it("usa o texto de taxa informado pelo restaurante", () => {
    expect(buildOrderMessage(base, "X", { taxaEntrega: "taxa de R$ 5,00" })).toContain("*Subtotal: R$ 58,00* (taxa de R$ 5,00)");
  });
});

describe("normalizePhone", () => {
  it("converte telefone brasileiro formatado para dígitos com DDI", () => {
    expect(normalizePhone("(11) 94832-5987")).toBe("5511948325987");
  });
  it("mantém o DDI quando já informado", () => {
    expect(normalizePhone("+55 11 94832-5987")).toBe("5511948325987");
  });
});

describe("buildWhatsAppUrl", () => {
  it("gera link wa.me com o texto íntegro, inclusive caracteres especiais", () => {
    const text = "A & B #1\nçã 🍛 100%";
    const url = new URL(buildWhatsAppUrl("(11) 94832-5987", text));
    expect(url.origin + url.pathname).toBe("https://wa.me/5511948325987");
    expect(url.searchParams.get("text")).toBe(text);
  });
});
