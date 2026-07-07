import { describe, it, expect } from "vitest";
import { analisarExercicio } from "./analisar";

describe("analisarExercicio", () => {
  it("cataloga força, massa e aceleração na 2ª lei de Newton", () => {
    const resultado = analisarExercicio(
      "Um corpo com massa de 2 kg possui aceleração de 2 m/s². Qual a força?"
    );

    expect(resultado.variaveis).toContain("massa.modulo");
    expect(resultado.variaveis).toContain("aceleracao.modulo");
    expect(resultado.variaveis).toContain("forca.resultante");
    expect(resultado.formulas).toContain("segunda_lei_newton");
    expect(resultado.computedAnswer).toBe(4);
    expect(resultado.computedUnit).toBe("N");
    expect(resultado.confidence).toBeGreaterThan(0.5);
    expect(resultado.resolverMethod).toBe("regras");
  });

  it("detecta entidades e fenômenos associados a carro", () => {
    const resultado = analisarExercicio(
      "Um carro freia com aceleração de 3 m/s². Qual a força se a massa é 1000 kg?"
    );

    expect(resultado.entidades).toContain("carro");
    expect(resultado.fenomenos).toContain("freada_veiculo");
  });

  it("retorna baixa confiança para texto sem grandezas físicas", () => {
    const resultado = analisarExercicio("Explique o que é física.");

    expect(resultado.formulas.length).toBe(0);
    expect(resultado.confidence).toBeLessThan(0.6);
  });
});
