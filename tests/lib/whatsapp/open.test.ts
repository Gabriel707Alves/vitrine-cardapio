import { describe, expect, it, vi } from "vitest";
import { openWhatsApp } from "@/lib/whatsapp/open";

const url = "https://wa.me/5511900000000?text=oi";

describe("openWhatsApp", () => {
  it("no celular navega na mesma aba (navegador do Instagram/WhatsApp bloqueia nova aba)", () => {
    const assign = vi.fn(), open = vi.fn();
    openWhatsApp(url, { isTouch: true, assign, open });
    expect(assign).toHaveBeenCalledWith(url);
    expect(open).not.toHaveBeenCalled();
  });

  it("no computador abre em nova aba e mantém o site aberto", () => {
    const assign = vi.fn(), open = vi.fn(() => ({}) as Window);
    openWhatsApp(url, { isTouch: false, assign, open });
    expect(open).toHaveBeenCalledWith(url, "_blank");
    expect(assign).not.toHaveBeenCalled();
  });

  it("no computador, se a nova aba for bloqueada, navega na mesma aba", () => {
    const assign = vi.fn(), open = vi.fn(() => null);
    openWhatsApp(url, { isTouch: false, assign, open });
    expect(assign).toHaveBeenCalledWith(url);
  });
});
