import { cacheLife } from "next/cache";
import { loadMenu, MENU_REVALIDATE } from "./load";

/** Cardápio com cache do Next (Cache Components): relê a planilha a cada 5 minutos. */
export async function getMenu() {
  "use cache";
  cacheLife({ stale: MENU_REVALIDATE, revalidate: MENU_REVALIDATE, expire: 24 * 60 * 60 });
  return loadMenu();
}
