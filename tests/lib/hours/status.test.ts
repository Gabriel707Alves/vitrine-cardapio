import { describe, expect, it } from "vitest";
import { getOpenStatus, type Horario } from "@/lib/hours/status";

const todosOsDias: Horario[] = [{ dias: [0, 1, 2, 3, 4, 5, 6], abre: "11:00", fecha: "15:30" }];
const semana: Horario[] = [{ dias: [1, 2, 3, 4, 5], abre: "11:00", fecha: "15:30" }];

// 2026-11-26 é quinta-feira (dia 4). São Paulo = UTC−3.
describe("getOpenStatus", () => {
  it("aberto ao meio-dia em São Paulo, com hora de fechar", () => {
    expect(getOpenStatus(new Date("2026-11-26T15:00:00Z"), todosOsDias)).toEqual({ aberto: true, fechaAs: "15:30" });
  });

  it("fechado às 16h, abre no dia seguinte", () => {
    expect(getOpenStatus(new Date("2026-11-26T19:00:00Z"), todosOsDias)).toEqual({
      aberto: false,
      proximaAbertura: { dia: 5, hora: "11:00" },
    });
  });

  it("fechado às 9h, abre no mesmo dia", () => {
    expect(getOpenStatus(new Date("2026-11-26T12:00:00Z"), todosOsDias)).toEqual({
      aberto: false,
      proximaAbertura: { dia: 4, hora: "11:00" },
    });
  });

  it("no sábado de um horário de segunda a sexta, abre na segunda", () => {
    expect(getOpenStatus(new Date("2026-11-28T15:00:00Z"), semana)).toEqual({
      aberto: false,
      proximaAbertura: { dia: 1, hora: "11:00" },
    });
  });

  it("às 15:30 em ponto já está fechado", () => {
    expect(getOpenStatus(new Date("2026-11-26T18:30:00Z"), todosOsDias).aberto).toBe(false);
  });

  it("sem horários cadastrados fica fechado sem próxima abertura", () => {
    expect(getOpenStatus(new Date("2026-11-26T15:00:00Z"), [])).toEqual({ aberto: false });
  });
});
