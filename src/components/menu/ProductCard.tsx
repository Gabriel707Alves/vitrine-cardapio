"use client";

import Image from "next/image";
import { useCart } from "@/components/cart/CartProvider";
import { formatBRL } from "@/lib/format/currency";
import type { MenuItem } from "@/lib/menu/types";
import s from "./menu.module.css";

export function ProductCard({ item }: { item: MenuItem }) {
  const { qtyOf, dispatch } = useCart();
  const qty = qtyOf(item.id);
  return (
    <li className={s.item}>
      {item.foto && (
        <Image className={s.thumb} src={item.foto} alt="" width={160} height={160} sizes="80px" />
      )}
      <div className={s.text}>
        <span className={s.name}>{item.nome}</span>
        {item.descricao && <p className={s.desc}>{item.descricao}</p>}
        <span className={s.price}>{formatBRL(item.preco)}</span>
      </div>
      <div className={s.actions}>
        {qty === 0 ? (
          <button type="button" className={s.add} aria-label={`Adicionar ${item.nome}`} onClick={() => dispatch({ type: "add", id: item.id })}>
            <PlusIcon />
          </button>
        ) : (
          <div className={s.stepper}>
            <button type="button" className={s.step} aria-label={`Remover um ${item.nome}`} onClick={() => dispatch({ type: "decrement", id: item.id })}>
              <MinusIcon />
            </button>
            <span className={s.qty} data-qty aria-live="polite">
              {qty}
            </span>
            <button type="button" className={s.step} aria-label={`Adicionar mais um ${item.nome}`} onClick={() => dispatch({ type: "add", id: item.id })}>
              <PlusIcon />
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
