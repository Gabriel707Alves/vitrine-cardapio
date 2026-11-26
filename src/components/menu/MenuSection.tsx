import { Photo } from "@/components/sections/Photo";
import { cliente } from "@/config/cliente";
import { slugify } from "@/lib/menu/csv";
import type { Menu } from "@/lib/menu/types";
import { ProductCard } from "./ProductCard";
import s from "./menu.module.css";

/** O cardápio: cabeçalho, atalhos de categoria e os grupos com botão de adicionar. */
export function MenuSection({ menu }: { menu: Menu }) {
  const categorias = menu.categorias
    .map((c) => ({ ...c, itens: c.itens.filter((i) => i.disponivel) }))
    .filter((c) => c.itens.length > 0);
  const [primeira, ...resto] = categorias;

  return (
    <section className="section" id="cardapio" aria-labelledby="cardapio-h" style={{ "--h": 2 } as React.CSSProperties}>
      <div className="wrap">
        <div className="section-head--split">
          <div>
            <h2 id="cardapio-h">{cliente.textos.cardapioTitulo}</h2>
            <p>{cliente.textos.cardapioLinha}</p>
          </div>
          {categorias.length > 1 && (
            <nav aria-label="Categorias do cardápio" className={s.chips}>
              {categorias.map((c) => (
                <a key={c.nome} className={s.chip} href={`#cat-${slugify(c.nome)}`}>
                  {c.nome}
                </a>
              ))}
            </nav>
          )}
        </div>
        {primeira && (
          <div className={`grid grid--top ${s.groups}`}>
            <Group nome={primeira.nome} itens={primeira.itens} className="span-6" />
            <div className="span-6 start-7 stack-8">
              <div className={s.pair}>
                {cliente.fotos.cardapio.map((f) => (
                  <figure key={f.src} className={s.pairPhoto}>
                    <Photo foto={f} sizes="(max-width: 639px) 50vw, 300px" width={600} height={750} />
                  </figure>
                ))}
              </div>
              {resto.map((c) => (
                <Group key={c.nome} nome={c.nome} itens={c.itens} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Group({ nome, itens, className }: { nome: string; itens: Menu["categorias"][number]["itens"]; className?: string }) {
  const id = `cat-${slugify(nome)}`;
  return (
    <div className={className} id={id}>
      <p className={`t-label ${s.label}`}>{nome}</p>
      <ul className={s.list} aria-label={nome}>
        {itens.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
