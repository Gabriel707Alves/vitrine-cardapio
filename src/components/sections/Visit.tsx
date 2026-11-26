import { cliente } from "@/config/cliente";
import { Hours } from "@/components/layout/Hours";
import { OpenStatus } from "./OpenStatus";
import { Photo } from "./Photo";

export function Visit() {
  const { endereco, textos, fotos } = cliente;
  return (
    <section className="section" id="visita" data-place="visit" aria-labelledby="visita-h">
      <div className="wrap">
        <h2 id="visita-h">{textos.visitaTitulo}</h2>
        <p className="type-moment">
          <a href={endereco.mapsUrl}>
            {endereco.rua}, {endereco.bairro}
          </a>
        </p>
        <div className="grid grid--top" style={{ marginTop: "var(--s-7)" }}>
          <div className="visit span-6 stack-4">
            {cliente.horarioConfirmado && <OpenStatus horarios={cliente.horarios} className="t-lead" />}
            <div className="visit__cols">
              <div className="stack-4">
                <address className="visit__address">
                  <a className="link" href={endereco.mapsUrl}>
                    {endereco.rua}
                    {endereco.complemento ? ` · ${endereco.complemento}` : ""}
                    <br />
                    {endereco.bairro}, {endereco.cidade}
                  </a>
                </address>
                {cliente.telefone && (
                  <p>
                    <a className="link" href={`tel:+55${cliente.telefone.replace(/\D/g, "")}`}>
                      {cliente.telefone}
                    </a>
                  </p>
                )}
                <div className="btn-row">
                  <a className="btn btn--secondary" href={endereco.mapsUrl}>
                    Ver no mapa
                  </a>
                </div>
              </div>
              <Hours />
            </div>
          </div>
          <figure className="pl-photo pl-photo--end span-6 start-7" style={{ "--pl-r": 1.3333 } as React.CSSProperties}>
            <Photo foto={fotos.visita} />
          </figure>
        </div>
      </div>
    </section>
  );
}
