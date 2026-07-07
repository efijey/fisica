import { catalogoFormulas, type AreaFisica, type Formula } from "../formulas/catalog";
import { catalogoVariaveis, type VariavelFisica } from "../variables/catalog";
import { catalogoFenomenos, type Fenomeno } from "../phenomena/catalog";

export interface FormulaConectada {
  formula: Formula;
  area: AreaFisica;
}

export interface ConexaoVariavel {
  variavel: VariavelFisica;
  totalFormulas: number;
  formulas: FormulaConectada[];
  areas: AreaFisica[];
  fenomenos: Fenomeno[];
}

export function contarFormulasPorVariavel(variavelId: string): number {
  return catalogoFormulas.filter((f) => f.variaveis.includes(variavelId)).length;
}

export function obterFormulasPorVariavel(variavelId: string): FormulaConectada[] {
  return catalogoFormulas
    .filter((f) => f.variaveis.includes(variavelId))
    .map((formula) => ({ formula, area: formula.area }));
}

export function obterFenomenosPorVariavel(variavelId: string): Fenomeno[] {
  return catalogoFenomenos.filter((f) => f.variaveis.includes(variavelId));
}

export function obterFenomenosPorFormula(formulaId: string): Fenomeno[] {
  return catalogoFenomenos.filter((f) => f.formulas.includes(formulaId));
}

export function obterConexaoVariavel(variavelId: string): ConexaoVariavel | undefined {
  const variavel = catalogoVariaveis.find((v) => v.id === variavelId);
  if (!variavel) return undefined;

  const formulas = obterFormulasPorVariavel(variavelId);
  const areas = [...new Set(formulas.map((f) => f.area))];
  const fenomenos = obterFenomenosPorVariavel(variavelId);

  return {
    variavel,
    totalFormulas: formulas.length,
    formulas,
    areas,
    fenomenos,
  };
}

export function obterGrafoConexoes(): ConexaoVariavel[] {
  const variaveisUsadas = new Set<string>();
  for (const formula of catalogoFormulas) {
    for (const v of formula.variaveis) {
      variaveisUsadas.add(v);
    }
  }

  return [...variaveisUsadas]
    .map((id) => obterConexaoVariavel(id))
    .filter((c): c is ConexaoVariavel => c !== undefined)
    .sort((a, b) => b.totalFormulas - a.totalFormulas);
}

export function listarVariaveisMaisConectadas(limite?: number): ConexaoVariavel[] {
  const grafo = obterGrafoConexoes();
  return limite ? grafo.slice(0, limite) : grafo;
}

export function obterVariaveisUsadasEmFormulas(): string[] {
  const ids = new Set<string>();
  for (const formula of catalogoFormulas) {
    for (const v of formula.variaveis) {
      ids.add(v);
    }
  }
  return [...ids];
}
