import { cliente } from "@/config/cliente";
import { Photo } from "./Photo";

export function Hero() {
  const { textos, fotos } = cliente;
  return (
    <section className="hero hero--place" data-enter aria-labelledby="hero-h">
      <Photo foto={fotos.hero} className="hero__bg" priority sizes="100vw" width={1600} height={1000} />
      <div className="wrap">
        <div className="hero-text">
          <div className="hero__text">
            <h1 id="hero-h">{textos.heroTitulo}</h1>
            <p className="hero__lead">{textos.heroLead}</p>
            <div className="btn-row">
              <a className="btn btn--primary" href="#cardapio">
                Pedir marmita
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
