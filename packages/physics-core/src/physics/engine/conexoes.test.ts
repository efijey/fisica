import { describe, it, expect } from "vitest";
import {
  contarFormulasPorVariavel,
  obterConexaoVariavel,
  obterFenomenosPorVariavel,
  obterFenomenosPorFormula,
  obterFormulasPorVariavel,
  obterGrafoConexoes,
  listarVariaveisMaisConectadas,
  obterVariaveisUsadasEmFormulas,
} from "./conexoes";

describe("contarFormulasPorVariavel", () => {
  it("conta fórmulas que incluem a variável", () => {
    expect(contarFormulasPorVariavel("aceleracao.modulo")).toBe(4);
  });

  it("retorna zero para variável não usada em fórmulas", () => {
    expect(contarFormulasPorVariavel("tensao.modulo")).toBe(0);
  });
});

describe("obterFormulasPorVariavel", () => {
  it("retorna fórmulas com área associada", () => {
    const formulas = obterFormulasPorVariavel("aceleracao.modulo");
    const ids = formulas.map((f) => f.formula.id);

    expect(ids).toContain("mruv_velocidade_final");
    expect(ids).toContain("mruv_posicao_final");
    expect(ids).toContain("torricelli");
    expect(ids).toContain("segunda_lei_newton");
    expect(formulas.every((f) => f.area === f.formula.area)).toBe(true);
  });
});

describe("obterFenomenosPorVariavel", () => {
  it("retorna fenômenos ligados à aceleração", () => {
    const fenomenos = obterFenomenosPorVariavel("aceleracao.modulo");
    const ids = fenomenos.map((f) => f.id);

    expect(ids).toContain("freada_veiculo");
    expect(ids).toContain("queda_livre");
    expect(ids).toContain("arrancada_veiculo");
  });
});

describe("obterFenomenosPorFormula", () => {
  it("retorna fenômenos ligados à 2ª lei de Newton", () => {
    const fenomenos = obterFenomenosPorFormula("segunda_lei_newton");
    expect(fenomenos.length).toBeGreaterThan(0);
    expect(fenomenos.some((f) => f.id === "freada_veiculo")).toBe(true);
  });
});

describe("obterConexaoVariavel", () => {
  it("monta conexão completa para aceleração", () => {
    const conexao = obterConexaoVariavel("aceleracao.modulo");

    expect(conexao).toBeDefined();
    expect(conexao!.variavel.simbolo).toBe("a");
    expect(conexao!.totalFormulas).toBe(4);
    expect(conexao!.areas).toContain("cinematica");
    expect(conexao!.areas).toContain("dinamica");
    expect(conexao!.fenomenos.length).toBeGreaterThan(0);
  });

  it("retorna undefined para id inexistente", () => {
    expect(obterConexaoVariavel("inexistente")).toBeUndefined();
  });
});

describe("obterGrafoConexoes", () => {
  it("lista variáveis usadas em fórmulas ordenadas por frequência", () => {
    const grafo = obterGrafoConexoes();

    expect(grafo.length).toBeGreaterThan(0);
    expect(grafo[0].totalFormulas).toBeGreaterThanOrEqual(
      grafo[grafo.length - 1].totalFormulas
    );
  });

  it("cada entrada tem fórmulas e áreas consistentes", () => {
    const grafo = obterGrafoConexoes();

    for (const conexao of grafo) {
      expect(conexao.totalFormulas).toBe(conexao.formulas.length);
      expect(conexao.areas.length).toBeGreaterThan(0);
      expect(
        conexao.areas.every((a) => conexao.formulas.some((f) => f.area === a))
      ).toBe(true);
    }
  });
});

describe("listarVariaveisMaisConectadas", () => {
  it("respeita o limite informado", () => {
    expect(listarVariaveisMaisConectadas(5)).toHaveLength(5);
  });
});

describe("obterVariaveisUsadasEmFormulas", () => {
  it("retorna apenas variáveis presentes no catálogo de fórmulas", () => {
    const ids = obterVariaveisUsadasEmFormulas();
    expect(ids).toContain("massa.modulo");
    expect(ids).not.toContain("tensao.modulo");
  });
});
