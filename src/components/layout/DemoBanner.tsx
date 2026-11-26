import { cliente } from "@/config/cliente";

/** Faixa fixa no topo enquanto o site é uma proposta (NEXT_PUBLIC_DEMO_MODE=true). */
export function DemoBanner() {
  const { autor } = cliente;
  return (
    <div className="demo-banner" role="note">
      <p>
        <strong>Demonstração</strong> · proposta de site para {cliente.nome}, criada por{" "}
        {autor.contato ? (
          <a className="link" href={autor.contato}>
            {autor.nome}
          </a>
        ) : (
          autor.nome
        )}
      </p>
    </div>
  );
}
