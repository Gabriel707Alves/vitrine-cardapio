type Env = {
  isTouch: boolean;
  assign: (url: string) => void;
  open: (url: string, target: string) => Window | null;
};

function browserEnv(): Env {
  return {
    isTouch: window.matchMedia?.("(pointer: coarse)").matches ?? false,
    assign: (u) => window.location.assign(u),
    open: (u, t) => window.open(u, t),
  };
}

/**
 * Abre o WhatsApp com o pedido. No celular navega na mesma aba: os navegadores embutidos
 * (Instagram, Facebook, WhatsApp) costumam ignorar window.open. No computador abre em nova aba.
 */
export function openWhatsApp(url: string, env: Env = browserEnv()): void {
  if (env.isTouch) return env.assign(url);
  const win = env.open(url, "_blank");
  if (!win) env.assign(url);
  else win.opener = null;
}
