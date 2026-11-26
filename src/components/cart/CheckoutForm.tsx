"use client";

import { useRef, useState, type FormEvent } from "react";
import { cliente } from "@/config/cliente";
import { buildOrderMessage, buildWhatsAppUrl, type Pagamento } from "@/lib/whatsapp/order";
import { toOrderFields, validateCheckout, type CheckoutErrors, type CheckoutInput } from "@/lib/whatsapp/validate";
import { useCart } from "./CartProvider";
import s from "./cart.module.css";

const PAGAMENTOS: Record<Pagamento, string> = { pix: "Pix", dinheiro: "Dinheiro", cartao: "Cartão na entrega" };

export function CheckoutForm() {
  const { resolved } = useCart();
  const [input, setInput] = useState<CheckoutInput>({
    tipo: "entrega",
    nome: "",
    endereco: "",
    pagamento: cliente.pagamentos[0] ?? "pix",
    troco: "",
    observacao: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const set = <K extends keyof CheckoutInput>(k: K, v: CheckoutInput[K]) => setInput((p) => ({ ...p, [k]: v }));

  function submit(e: FormEvent) {
    e.preventDefault();
    const found = validateCheckout(input);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    const text = buildOrderMessage(
      { lines: resolved.lines, subtotal: resolved.subtotal, ...toOrderFields(input) },
      cliente.nome,
      { taxaEntrega: cliente.taxaEntrega },
    );
    window.open(buildWhatsAppUrl(cliente.whatsapp, text), "_blank", "noopener");
  }

  const err = (k: keyof CheckoutInput) =>
    errors[k] ? (
      <p className={s.error} id={`erro-${k}`}>
        {errors[k]}
      </p>
    ) : null;
  const aria = (k: keyof CheckoutInput) =>
    errors[k] ? { "aria-invalid": true as const, "aria-describedby": `erro-${k}` } : {};

  return (
    <form ref={formRef} className={s.form} onSubmit={submit} noValidate>
      <fieldset className={s.fieldset}>
        <legend className={s.legend}>Como quer receber?</legend>
        <div className={s.options}>
          {(["entrega", "retirada"] as const).map((t) => (
            <label key={t} className={s.option}>
              <input type="radio" name="tipo" value={t} checked={input.tipo === t} onChange={() => set("tipo", t)} />
              {t === "entrega" ? "Receber em casa" : "Retirar no local"}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={s.field}>
        <label htmlFor="ck-nome">Seu nome</label>
        <input id="ck-nome" name="nome" autoComplete="name" value={input.nome} onChange={(e) => set("nome", e.target.value)} {...aria("nome")} />
        {err("nome")}
      </div>

      {input.tipo === "entrega" && (
        <div className={s.field}>
          <label htmlFor="ck-endereco">Endereço de entrega</label>
          <input
            id="ck-endereco"
            name="endereco"
            autoComplete="street-address"
            placeholder="Rua, número e complemento…"
            value={input.endereco}
            onChange={(e) => set("endereco", e.target.value)}
            {...aria("endereco")}
          />
          {err("endereco")}
        </div>
      )}

      <fieldset className={s.fieldset}>
        <legend className={s.legend}>Pagamento</legend>
        <div className={s.options}>
          {cliente.pagamentos.map((p) => (
            <label key={p} className={s.option}>
              <input type="radio" name="pagamento" value={p} checked={input.pagamento === p} onChange={() => set("pagamento", p)} />
              {PAGAMENTOS[p]}
            </label>
          ))}
        </div>
      </fieldset>

      {input.pagamento === "dinheiro" && (
        <div className={s.field}>
          <label htmlFor="ck-troco">Troco para quanto? (opcional)</label>
          <input id="ck-troco" name="troco" inputMode="decimal" autoComplete="off" placeholder="Ex.: 100" value={input.troco} onChange={(e) => set("troco", e.target.value)} {...aria("troco")} />
          {err("troco")}
        </div>
      )}

      <div className={s.field}>
        <label htmlFor="ck-obs">Observação (opcional)</label>
        <textarea id="ck-obs" name="observacao" rows={2} autoComplete="off" value={input.observacao} onChange={(e) => set("observacao", e.target.value)} />
      </div>

      <button type="submit" className="btn btn--primary">
        Enviar pedido pelo WhatsApp
      </button>
      <p className={s.note}>Abre o WhatsApp com o pedido pronto. É só tocar em enviar.</p>
    </form>
  );
}
