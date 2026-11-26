import { cacheLife } from "next/cache";

/** Ano atual no rodapé, cacheado por um dia (Cache Components não aceita new Date() fora de cache). */
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
