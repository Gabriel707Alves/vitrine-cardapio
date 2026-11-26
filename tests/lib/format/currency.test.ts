import { describe, expect, it } from "vitest";
import { formatBRL } from "@/lib/format/currency";

describe("formatBRL", () => {
  it("formata centavos em reais com espaço normal", () => {
    expect(formatBRL(2500)).toBe("R$ 25,00");
  });
  it("formata valores menores que um real", () => {
    expect(formatBRL(5)).toBe("R$ 0,05");
  });
  it("usa ponto como separador de milhar", () => {
    expect(formatBRL(123456)).toBe("R$ 1.234,56");
  });
});
