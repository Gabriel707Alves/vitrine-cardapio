/* eslint-disable @next/next/no-img-element */
import { cliente } from "@/config/cliente";

export function Logo() {
  const { marca, nome } = cliente;
  return (
    <a className="nav__logo" href="#top" translate="no">
      {marca.tipo === "logo" ? (
        <img className="nav__logo-img" src={marca.src} alt="" width={36} height={36} />
      ) : (
        <span className="mark" data-mark={marca.mark} aria-hidden="true" />
      )}
      {nome}
    </a>
  );
}
