import { cliente } from "@/config/cliente";

/** Horários no formato do kit (system.js marca o dia de hoje e preenche [data-open-now]). */
export function Hours() {
  return (
    <dl
      className="hours"
      data-tz={cliente.horarioConfirmado ? "America/Sao_Paulo" : undefined}
      data-assumed={cliente.horarioConfirmado ? undefined : ""}
    >
      {cliente.horarioTexto.map((h) => (
        <div key={h.data} style={{ display: "contents" }}>
          <dt data-days={h.data}>{h.dias}</dt>
          <dd>{h.horas}</dd>
        </div>
      ))}
    </dl>
  );
}
