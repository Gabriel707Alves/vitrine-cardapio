import localMenu from "@/data/cardapio.json";
import { parseMenuCsv } from "./csv";
import type { Menu } from "./types";

/** Segundos entre releituras da planilha (usado em getMenu, cached.ts). */
export const MENU_REVALIDATE = 300;

/** Cardápio da planilha do Google (se configurada e válida) ou do JSON local. */
export async function loadMenu(): Promise<Menu> {
  const url = process.env.CARDAPIO_SHEET_URL;
  if (!url) return localMenu as Menu;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Planilha respondeu ${res.status}`);
    const menu = parseMenuCsv(await res.text());
    if (!menu.categorias.some((c) => c.itens.length > 0)) throw new Error("Planilha sem itens");
    return menu;
  } catch (err) {
    console.error("[cardapio] usando JSON local:", err);
    return localMenu as Menu;
  }
}
