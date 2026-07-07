import { describe, it, expect } from "vitest";
import { inferirFormulas, buscarVariavelPorId } from "./inferencia";

describe("inferirFormulas", () => {
  it("retorna vazio quando nenhuma variável é selecionada", () => {
    expect(inferirFormulas([])).toEqual([]);
  });

  it("retorna vazio quando todas as variáveis da fórmula estão selecionadas", () => {
    const resultados = inferirFormulas([
      "velocidade.media",
      "posicao.delta",
      "tempo.delta",
    ]);
    const velocidadeMedia = resultados.find(
      r => r.formula.id === "velocidade_media"
    );
    expect(velocidadeMedia).toBeUndefined();
  });

  it("encontra fórmula quando falta exatamente uma variável", () => {
    const resultados = inferirFormulas(["velocidade.media", "posicao.delta"]);

    const resultado = resultados.find(
      r => r.formula.id === "velocidade_media"
    );

    expect(resultado).toBeDefined();
    expect(resultado!.podeCalcular.id).toBe("tempo.delta");
    expect(resultado!.variacaoAplicavel.expressao).toBe("Δt = ΔS / Vm");
  });

  it("não retorna fórmula quando faltam duas ou mais variáveis", () => {
    const resultados = inferirFormulas(["velocidade.media"]);

    const velocidadeMedia = resultados.find(
      r => r.formula.id === "velocidade_media"
    );
    expect(velocidadeMedia).toBeUndefined();
  });

  it("retorna múltiplas fórmulas quando várias se aplicam", () => {
    const resultados = inferirFormulas([
      "velocidade.inicial",
      "aceleracao.modulo",
      "tempo.modulo",
    ]);

    const ids = resultados.map(r => r.formula.id);
    expect(ids).toContain("mruv_velocidade_final");
  });

  it("retorna a variação correta para cada variável faltante", () => {
    const resultados = inferirFormulas([
      "velocidade.final",
      "aceleracao.modulo",
      "tempo.modulo",
    ]);

    const resultado = resultados.find(
      r => r.formula.id === "mruv_velocidade_final"
    );

    expect(resultado).toBeDefined();
    expect(resultado!.podeCalcular.id).toBe("velocidade.inicial");
    expect(resultado!.variacaoAplicavel.expressao).toBe("v₀ = v - a·t");
  });
});

describe("buscarVariavelPorId", () => {
  it("retorna variável existente", () => {
    const variavel = buscarVariavelPorId("velocidade.media");
    expect(variavel).toBeDefined();
    expect(variavel!.simbolo).toBe("vₘ");
  });

  it("retorna undefined para id inexistente", () => {
    expect(buscarVariavelPorId("inexistente")).toBeUndefined();
  });
});
