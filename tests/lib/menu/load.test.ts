import { afterEach, describe, expect, it, vi } from "vitest";
import { loadMenu } from "@/lib/menu/load";
import localMenu from "@/data/cardapio.json";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("loadMenu", () => {
  it("usa o JSON local quando não há planilha configurada", async () => {
    vi.stubEnv("CARDAPIO_SHEET_URL", "");
    expect(await loadMenu()).toEqual(localMenu);
  });

  it("cai no JSON local quando a planilha responde com erro", async () => {
    vi.stubEnv("CARDAPIO_SHEET_URL", "https://sheet.test/csv");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("erro", { status: 500 })));
    expect(await loadMenu()).toEqual(localMenu);
  });

  it("cai no JSON local quando a rede falha", async () => {
    vi.stubEnv("CARDAPIO_SHEET_URL", "https://sheet.test/csv");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    expect(await loadMenu()).toEqual(localMenu);
  });

  it("usa a planilha quando ela responde com itens", async () => {
    vi.stubEnv("CARDAPIO_SHEET_URL", "https://sheet.test/csv");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("categoria,nome,descricao,preco,foto,disponivel\nA,B,,10,,", { status: 200 })));
    const menu = await loadMenu();
    expect(menu.categorias[0].itens[0].nome).toBe("B");
  });

  it("cai no JSON local quando a planilha está vazia", async () => {
    vi.stubEnv("CARDAPIO_SHEET_URL", "https://sheet.test/csv");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("categoria,nome,descricao,preco,foto,disponivel\n", { status: 200 })));
    expect(await loadMenu()).toEqual(localMenu);
  });
});
