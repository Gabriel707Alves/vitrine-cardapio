import { cliente } from "@/config/cliente";
import { formatBRL } from "@/lib/format/currency";
import { Photo } from "./Photo";

/** O lugar (composição "bleed"): cabeçalho na .wrap e uma foto de ponta a ponta. */
export function Buffet() {
  const { textos, fotos, precoKg } = cliente;
  return (
    <section className="section" id="buffet" aria-labelledby="buffet-h">
      <div className="wrap">
        <div className="section-head--split">
          <div>
            <h2 id="buffet-h">{textos.buffetTitulo}</h2>
            <p>
              {textos.buffetLinha}
              {precoKg && (
                <>
                  {" "}Quilo {formatBRL(precoKg.valor)}
                  {precoKg.aConfirmar && <span className="badge-assumed"> (valor a confirmar)</span>}.
                </>
              )}
            </p>
          </div>
        </div>
        <figure className="bleed-photo fill">
          <Photo foto={fotos.buffet} sizes="(max-width: 639px) 260vw, 100vw" width={2000} height={780} />
        </figure>
      </div>
    </section>
  );
}
