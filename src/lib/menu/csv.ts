import type { Menu, MenuCategory, MenuItem } from "./types";

/** "R$ 1.234,56" | "25,00" | "25.5" | "25" → centavos. Vazio ou inválido → 0. */
export function parsePrice(raw: string): number {
  let s = raw.replace(/[^\d.,]/g, "");
  if (!s) return 0;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  const n = Number(s);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

/** Divide o CSV em linhas de campos, respeitando aspas e aspas escapadas (""). */
function parseRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (quoted) {
      if (c === '"' && csv[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && csv[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim() !== ""));
}

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const FALSO = new Set(["nao", "não", "false", "0", "n"]);

/** Lê o CSV publicado da planilha (colunas: categoria, nome, descricao, preco, foto, disponivel). */
export function parseMenuCsv(csv: string): Menu {
  const [header, ...rows] = parseRows(csv);
  if (!header) return { categorias: [] };
  const col = (name: string) => header.findIndex((h) => slugify(h) === name);
  const idx = {
    categoria: col("categoria"),
    nome: col("nome"),
    descricao: col("descricao"),
    preco: col("preco"),
    foto: col("foto"),
    disponivel: col("disponivel"),
  };
  const get = (r: string[], i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");

  const categorias: MenuCategory[] = [];
  for (const r of rows) {
    const nome = get(r, idx.nome);
    if (!nome) continue;
    const categoria = get(r, idx.categoria) || "Cardápio";
    const item: MenuItem = {
      id: slugify(`${categoria} ${nome}`),
      categoria,
      nome,
      descricao: get(r, idx.descricao) || undefined,
      preco: parsePrice(get(r, idx.preco)),
      foto: get(r, idx.foto) || undefined,
      disponivel: !FALSO.has(get(r, idx.disponivel).toLowerCase()),
    };
    let cat = categorias.find((c) => c.nome === categoria);
    if (!cat) categorias.push((cat = { nome: categoria, itens: [] }));
    cat.itens.push(item);
  }
  return { categorias };
}
