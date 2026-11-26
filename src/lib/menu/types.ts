/** Item do cardápio. `preco` sempre em centavos. */
export type MenuItem = {
  id: string;
  categoria: string;
  nome: string;
  descricao?: string;
  preco: number;
  foto?: string;
  disponivel: boolean;
};

export type MenuCategory = { nome: string; itens: MenuItem[] };

export type Menu = { categorias: MenuCategory[] };
