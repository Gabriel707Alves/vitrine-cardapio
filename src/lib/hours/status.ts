/** Faixa de funcionamento. `dias`: 0 = domingo … 6 = sábado. Horas no formato "HH:MM". */
export type Horario = { dias: number[]; abre: string; fecha: string };

export type OpenStatus = {
  aberto: boolean;
  fechaAs?: string;
  proximaAbertura?: { dia: number; hora: string };
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Dia da semana e minuto do dia no fuso informado. */
function localNow(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  return { dia: WEEKDAYS.indexOf(get("weekday")), minuto: Number(get("hour")) * 60 + Number(get("minute")) };
}

export function getOpenStatus(now: Date, horarios: Horario[], timeZone = "America/Sao_Paulo"): OpenStatus {
  const { dia, minuto } = localNow(now, timeZone);

  for (const h of horarios) {
    if (h.dias.includes(dia) && minuto >= toMin(h.abre) && minuto < toMin(h.fecha)) {
      return { aberto: true, fechaAs: h.fecha };
    }
  }

  // Próxima abertura: hoje mais tarde, depois os próximos 7 dias.
  for (let offset = 0; offset <= 7; offset++) {
    const d = (dia + offset) % 7;
    const candidatas = horarios
      .filter((h) => h.dias.includes(d) && (offset > 0 || toMin(h.abre) > minuto))
      .map((h) => h.abre)
      .sort((a, b) => toMin(a) - toMin(b));
    if (candidatas.length) return { aberto: false, proximaAbertura: { dia: d, hora: candidatas[0] } };
  }
  return { aberto: false };
}
