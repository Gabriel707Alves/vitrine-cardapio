import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartButton } from "@/components/cart/CartButton";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MenuSection } from "@/components/menu/MenuSection";
import type { Menu } from "@/lib/menu/types";

const menu: Menu = {
  categorias: [
    { nome: "Pratos do dia", itens: [{ id: "bife", categoria: "Pratos do dia", nome: "Bife acebolado", preco: 2500, disponivel: true }] },
    { nome: "Bebidas", itens: [{ id: "coca", categoria: "Bebidas", nome: "Coca-Cola 350 ml", preco: 800, disponivel: true }] },
  ],
};

function App() {
  return (
    <CartProvider menu={menu} slug="teste">
      <CartButton />
      <MenuSection menu={menu} />
      <CartDrawer />
    </CartProvider>
  );
}

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

describe("fluxo do pedido", () => {
  it("adiciona item, mostra contador e envia pedido de retirada pelo WhatsApp", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => ({}) as Window);
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Adicionar Bife acebolado" }));
    const cartBtn = screen.getByRole("button", { name: /carrinho/i });
    expect(cartBtn).toHaveTextContent("1");

    await user.click(cartBtn);
    const dialog = await screen.findByRole("dialog", { name: "Seu pedido" });
    expect(within(dialog).getByText("R$ 25,00", { selector: "strong" })).toBeInTheDocument();

    await user.click(within(dialog).getByLabelText("Retirar no local"));
    await user.type(within(dialog).getByLabelText("Seu nome"), "Ana");
    await user.click(within(dialog).getByLabelText("Pix"));
    await user.click(within(dialog).getByRole("button", { name: "Enviar pedido pelo WhatsApp" }));

    expect(open).toHaveBeenCalledTimes(1);
    const url = String(open.mock.calls[0][0]);
    expect(url.startsWith("https://wa.me/55")).toBe(true);
    expect(new URL(url).searchParams.get("text")).toContain("1x Bife acebolado — R$ 25,00");
  });

  it("mostra erro embaixo do campo quando falta o endereço na entrega", async () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => ({}) as Window);
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Adicionar Coca-Cola 350 ml" }));
    await user.click(screen.getByRole("button", { name: /carrinho/i }));
    const dialog = await screen.findByRole("dialog", { name: "Seu pedido" });
    await user.type(within(dialog).getByLabelText("Seu nome"), "Ana");
    await user.click(within(dialog).getByRole("button", { name: "Enviar pedido pelo WhatsApp" }));
    const endereco = within(dialog).getByLabelText("Endereço de entrega");
    expect(endereco).toHaveAttribute("aria-invalid", "true");
    expect(within(dialog).getByText("Informe o endereço de entrega")).toBeInTheDocument();
    expect(open).not.toHaveBeenCalled();
  });

  it("o card troca o + por controle de quantidade", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "Adicionar Bife acebolado" }));
    expect(screen.getByRole("button", { name: "Adicionar mais um Bife acebolado" })).toBeInTheDocument();
    expect(screen.getByText("1", { selector: "[data-qty]" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remover um Bife acebolado" }));
    expect(screen.getByRole("button", { name: "Adicionar Bife acebolado" })).toBeInTheDocument();
  });
});
