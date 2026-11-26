import type { OpenStatus } from "./status";

const DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Frase curta do status: "Aberto agora · fecha às 15:30" / "Fechado · abre amanhã às 11:00". */
export function openStatusLabel(status: OpenStatus, hoje: number): string {
  if (status.aberto) return `Aberto agora · fecha às ${status.fechaAs}`;
  if (!status.proximaAbertura) return "Fechado";
  const { dia, hora } = status.proximaAbertura;
  const quando = dia === hoje ? "hoje" : dia === (hoje + 1) % 7 ? "amanhã" : DIAS[dia];
  return `Fechado · abre ${quando} às ${hora}`;
}
