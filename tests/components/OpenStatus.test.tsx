import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OpenStatus } from "@/components/sections/OpenStatus";
import type { Horario } from "@/lib/hours/status";

const horarios: Horario[] = [{ dias: [0, 1, 2, 3, 4, 5, 6], abre: "11:00", fecha: "15:30" }];
const seg_sex: Horario[] = [{ dias: [1, 2, 3, 4, 5], abre: "11:00", fecha: "15:30" }];

afterEach(() => vi.useRealTimers());

// 2026-11-26 é quinta-feira; São Paulo = UTC−3.
describe("OpenStatus", () => {
  it("mostra aberto e o horário de fechar ao meio-dia", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-26T15:00:00Z"));
    render(<OpenStatus horarios={horarios} />);
    expect(await screen.findByText("Aberto agora · fecha às 15:30")).toBeInTheDocument();
  });

  it("mostra fechado e que abre amanhã às 16h", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-26T19:00:00Z"));
    render(<OpenStatus horarios={horarios} />);
    expect(await screen.findByText("Fechado · abre amanhã às 11:00")).toBeInTheDocument();
  });

  it("antes de abrir diz que abre hoje", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-26T12:00:00Z"));
    render(<OpenStatus horarios={horarios} />);
    expect(await screen.findByText("Fechado · abre hoje às 11:00")).toBeInTheDocument();
  });

  it("no sábado de um horário de semana diz o dia da reabertura", async () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-11-28T15:00:00Z"));
    render(<OpenStatus horarios={seg_sex} />);
    expect(await screen.findByText("Fechado · abre segunda às 11:00")).toBeInTheDocument();
  });
});
