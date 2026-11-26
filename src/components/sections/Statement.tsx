import { cliente } from "@/config/cliente";

/** Momento word-highlight (taste-skill): uma frase grande que ganha tinta palavra por palavra. */
export function Statement() {
  const { rotulo, texto, destaque } = cliente.textos.declaracao;
  const [antes, depois] = texto.split(destaque);
  return (
    <section className="section statement" id="cozinha" data-moment="word-highlight" aria-label={rotulo}>
      <div className="wrap">
        <p className="t-label">{rotulo}</p>
        <p className="mo-wh__text">
          {antes}
          {depois !== undefined ? <strong>{destaque}</strong> : null}
          {depois}
        </p>
      </div>
    </section>
  );
}
