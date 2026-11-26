/* eslint-disable @next/next/no-img-element */
import { cliente } from "@/config/cliente";
import { buildWhatsAppUrl } from "@/lib/whatsapp/order";
import { CurrentYear } from "./CurrentYear";
import { Hours } from "./Hours";

export function Footer() {
  const { endereco, textos, fotos } = cliente;
  return (
    <footer className="footer closing footer--columns" id="contato" aria-labelledby="close-h">
      <div className="wrap">
          <div className="closing__cta close--photo">
            <div className="section-head--split">
              <div>
                <h2 id="close-h">{textos.fechamentoTitulo}</h2>
                <p className="t-lead">{textos.fechamentoLinha}</p>
              </div>
              <a className="btn btn--primary" href="#cardapio">
                Pedir marmita
                <svg className="m-arrow" viewBox="0 0 12 12" aria-hidden="true">
                  <path className="m-arrow__stem" d="M1 6h8" />
                  <path className="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5" />
                </svg>
              </a>
            </div>
            <div className="close__media">
              <img src={fotos.fechamento.src} alt={fotos.fechamento.alt} loading="lazy" style={{ objectPosition: fotos.fechamento.pos }} />
            </div>
          </div>
        <div className="closing__links">
          <div className="grid">
            <div className="span-4 stack-4">
              <h3>Endereço</h3>
              <address className="footer__address">
                <a className="link" href={endereco.mapsUrl}>
                  {endereco.rua}
                  {endereco.complemento ? `, ${endereco.complemento}` : ""}
                  <br />
                  {endereco.bairro}, {endereco.cidade}
                </a>
              </address>
            </div>
            <div className="span-4 stack-4">
              <h3>Contato</h3>
              <ul className="footer__list">
                <li>
                  <a className="link" href={buildWhatsAppUrl(cliente.whatsapp, `Olá, ${cliente.nome}!`)}>
                    WhatsApp {cliente.whatsapp}
                  </a>
                </li>
                {cliente.telefone && (
                  <li>
                    <a className="link" href={`tel:+55${cliente.telefone.replace(/\D/g, "")}`}>
                      Telefone {cliente.telefone}
                    </a>
                  </li>
                )}
                {cliente.instagram && (
                  <li>
                    <a className="link" href={`https://www.instagram.com/${cliente.instagram}/`}>
                      Instagram @{cliente.instagram}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div className="span-4 stack-4">
              <h3>Horários</h3>
              <Hours />
            </div>
          </div>
          <div className="footer__legal">
            <span>
              © <CurrentYear /> {cliente.nome}
            </span>
            <span>
              Site por{" "}
              {cliente.autor.contato ? (
                <a className="link" href={cliente.autor.contato}>
                  {cliente.autor.nome}
                </a>
              ) : (
                cliente.autor.nome
              )}
            </span>
            {cliente.creditosFotos && (
              <details className="credits">
                <summary>Créditos das fotos</summary>
                <p>{cliente.creditosFotos}</p>
              </details>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
