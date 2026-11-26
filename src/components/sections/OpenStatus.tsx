"use client";

import { useEffect, useState } from "react";
import { getOpenStatus, type Horario } from "@/lib/hours/status";
import { openStatusLabel } from "@/lib/hours/label";

const TZ = "America/Sao_Paulo";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function weekdayIn(tz: string, now: Date) {
  return WEEKDAYS.indexOf(new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(now));
}

/** "Aberto agora / Fechado · abre …", calculado no navegador depois de montar (o HTML estático não sabe a hora). */
export function OpenStatus({ horarios, className }: { horarios: Horario[]; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setLabel(openStatusLabel(getOpenStatus(now, horarios, TZ), weekdayIn(TZ, now)));
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [horarios]);

  return (
    <p className={className} aria-live="polite">
      {label}
    </p>
  );
}
