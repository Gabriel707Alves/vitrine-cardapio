import type { ReactNode } from "react";
import { isDemo } from "@/lib/site/demo";
import { DemoBanner } from "./DemoBanner";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#cardapio", label: "Cardápio" },
  { href: "#buffet", label: "Buffet" },
  { href: "#visita", label: "Visita" },
];

/** Cabeçalho fixo. `actions` recebe o botão do carrinho (client component). */
export function Header({ actions }: { actions?: ReactNode }) {
  return (
    <header className="nav">
      {isDemo() && <DemoBanner />}
      <div className="wrap nav__bar">
        <a className="skip-link" href="#top">
          Pular para o conteúdo
        </a>
        <Logo />
        <nav className="nav__links" aria-label="Principal">
          {LINKS.map((l) => (
            <div className="nav__item" key={l.href}>
              <a className="nav__link" href={l.href}>
                {l.label}
              </a>
            </div>
          ))}
        </nav>
        <div className="nav__actions">
          {actions}
          <a className="btn btn--primary" href="#cardapio">
            Pedir marmita
          </a>
        </div>
        <button className="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path d="M2 5h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
