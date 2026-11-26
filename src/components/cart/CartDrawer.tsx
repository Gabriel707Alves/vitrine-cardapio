"use client";

import { useEffect, useRef } from "react";
import { cliente } from "@/config/cliente";
import { formatBRL } from "@/lib/format/currency";
import { getOpenStatus } from "@/lib/hours/status";
import { openStatusLabel } from "@/lib/hours/label";
import { CheckoutForm } from "./CheckoutForm";
import { useCart } from "./CartProvider";
import s from "./cart.module.css";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])';

export function CartDrawer() {
  const { open, setOpen, resolved, dispatch } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const els = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      opener.current?.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;
  const fechado = closedLabel();

  return (
    <div className={s.backdrop} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div ref={panel} className={s.panel} role="dialog" aria-modal="true" aria-labelledby="cart-h">
        <div className={s.head}>
          <h2 id="cart-h" className={s.title}>Seu pedido</h2>
          <button type="button" className={s.close} aria-label="Fechar carrinho" onClick={() => setOpen(false)} data-autofocus>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M4 4l10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {resolved.count === 0 ? (
          <div className={s.empty}>
            <p>Seu carrinho está vazio.</p>
            <a className="btn btn--secondary" href="#cardapio" onClick={() => setOpen(false)}>
              Ver o cardápio
            </a>
          </div>
        ) : (
          <div className={s.body}>
            {fechado && (
              <p className={s.notice} role="status">
                Estamos fechados agora ({fechado.replace("Fechado · ", "")}). Seu pedido será visto quando abrirmos.
              </p>
            )}
            <ul className={s.lines}>
              {resolved.lines.map(({ item, qty, total }) => (
                <li key={item.id} className={s.line}>
                  <span className={s.lineName}>{item.nome}</span>
                  <span className={s.lineTotal}>{formatBRL(total)}</span>
                  <div className={s.lineQty}>
                    <button type="button" className={s.step} aria-label={`Remover um ${item.nome}`} onClick={() => dispatch({ type: "decrement", id: item.id })}>−</button>
                    <span aria-label={`${qty} unidades`}>{qty}</span>
                    <button type="button" className={s.step} aria-label={`Adicionar mais um ${item.nome}`} onClick={() => dispatch({ type: "add", id: item.id })}>+</button>
                  </div>
                </li>
              ))}
            </ul>
            <p className={s.subtotal}>
              <span>Subtotal</span>
              <strong>{formatBRL(resolved.subtotal)}</strong>
            </p>
            <p className={s.fee}>{cliente.taxaEntrega.charAt(0).toUpperCase() + cliente.taxaEntrega.slice(1)}.</p>
            <CheckoutForm />
          </div>
        )}
      </div>
    </div>
  );
}

/** "abre amanhã às 11:00" quando o restaurante está fechado (só com horário confirmado). */
function closedLabel(): string | null {
  if (!cliente.horarioConfirmado) return null;
  const now = new Date();
  const st = getOpenStatus(now, cliente.horarios);
  if (st.aberto) return null;
  const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short" }).format(now),
  );
  return openStatusLabel(st, dia);
}
