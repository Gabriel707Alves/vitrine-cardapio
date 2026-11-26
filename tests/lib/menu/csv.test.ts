import { describe, expect, it } from "vitest";
import { parseMenuCsv, parsePrice } from "@/lib/menu/csv";

describe("parsePrice", () => {
  it.each([
    ["25,00", 2500],
    ["R$ 25,00", 2500],
    ["25.5", 2550],
    ["25", 2500],
    ["1.234,56", 123456],
    ["", 0],
  ])("%s → %i centavos", (raw, expected) => {
    expect(parsePrice(raw)).toBe(expected);
  });
});

describe("parseMenuCsv", () => {
  const csv = [
    "Categoria,Nome,Descricao,Preco,Foto,Disponivel",
    'Pratos do dia,Bife acebolado,"Acompanha arroz, feijão e ""farofa""","25,00",,sim',
    "Pratos do dia,Feijoada,,23,https://x.test/f.jpg,",
    "",
    "Bebidas,Coca-Cola 350 ml,,8,,Não",
  ].join("\n");

  it("mantém vírgulas e aspas escapadas dentro de campos entre aspas", () => {
    const item = parseMenuCsv(csv).categorias[0].itens[0];
    expect(item.descricao).toBe('Acompanha arroz, feijão e "farofa"');
    expect(item.preco).toBe(2500);
  });

  it("agrupa por categoria na ordem em que aparecem", () => {
    const menu = parseMenuCsv(csv);
    expect(menu.categorias.map((c) => c.nome)).toEqual(["Pratos do dia", "Bebidas"]);
    expect(menu.categorias[0].itens.map((i) => i.nome)).toEqual(["Bife acebolado", "Feijoada"]);
  });

  it("disponível vazio é verdadeiro e 'Não' é falso", () => {
    const menu = parseMenuCsv(csv);
    expect(menu.categorias[0].itens[1].disponivel).toBe(true);
    expect(menu.categorias[1].itens[0].disponivel).toBe(false);
  });

  it("gera id estável a partir de categoria e nome", () => {
    expect(parseMenuCsv(csv).categorias[0].itens[0].id).toBe("pratos-do-dia-bife-acebolado");
  });

  it("lê foto e deixa descrição vazia como undefined", () => {
    const f = parseMenuCsv(csv).categorias[0].itens[1];
    expect(f.foto).toBe("https://x.test/f.jpg");
    expect(f.descricao).toBeUndefined();
  });

  it("aceita CRLF e cabeçalho em maiúsculas", () => {
    const menu = parseMenuCsv("CATEGORIA,NOME,DESCRICAO,PRECO,FOTO,DISPONIVEL\r\nA,B,,10,,\r\n");
    expect(menu.categorias[0].itens[0]).toMatchObject({ nome: "B", preco: 1000, disponivel: true });
  });
});
