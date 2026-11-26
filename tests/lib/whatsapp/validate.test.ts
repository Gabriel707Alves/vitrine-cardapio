import { describe, expect, it } from "vitest";
import { validateCheckout, toOrderFields, type CheckoutInput } from "@/lib/whatsapp/validate";

const ok: CheckoutInput = { tipo: "entrega", nome: "Ana", endereco: "Rua X, 123", pagamento: "pix", troco: "", observacao: "" };

describe("validateCheckout", () => {
  it("aceita um pedido completo", () => {
    expect(validateCheckout(ok)).toEqual({});
  });
  it("exige endereço na entrega", () => {
    expect(validateCheckout({ ...ok, endereco: "  " })).toEqual({ endereco: "Informe o endereço de entrega" });
  });
  it("exige nome", () => {
    expect(validateCheckout({ ...ok, nome: "" })).toEqual({ nome: "Informe seu nome" });
  });
  it("não exige endereço na retirada", () => {
    expect(validateCheckout({ ...ok, tipo: "retirada", endereco: "" })).toEqual({});
  });
  it("aceita dinheiro sem troco", () => {
    expect(validateCheckout({ ...ok, pagamento: "dinheiro", troco: "" })).toEqual({});
  });
  it("recusa troco que não é número", () => {
    expect(validateCheckout({ ...ok, pagamento: "dinheiro", troco: "abc" })).toEqual({ troco: "Informe um valor, ex.: 100" });
  });
});

describe("toOrderFields", () => {
  it("converte troco em centavos só quando o pagamento é dinheiro", () => {
    expect(toOrderFields({ ...ok, pagamento: "dinheiro", troco: "100" }).trocoPara).toBe(10000);
    expect(toOrderFields({ ...ok, pagamento: "pix", troco: "100" }).trocoPara).toBeUndefined();
  });
  it("descarta endereço na retirada", () => {
    expect(toOrderFields({ ...ok, tipo: "retirada" }).endereco).toBeUndefined();
  });
});
