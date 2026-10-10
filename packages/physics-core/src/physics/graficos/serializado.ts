import type {
  GrauEquacao,
  VisualizacaoGrafico,
  EixoGrafico,
  ParametroGrafico,
} from "./catalog";
import type { AreaFisica } from "../formulas/catalog";

/** Shape serializável (JSON / export) — sem função `avaliar`. */
export interface GraficoSerializado {
  id: string;
  formulaId: string;
  nome: string;
  eixosLabel: string;
  expressao: string;
  grau: GrauEquacao;
  area: AreaFisica;
  eixoX: EixoGrafico;
  eixoY: Omit<EixoGrafico, "min" | "max" | "amostras">;
  parametros: ParametroGrafico[];
  /** Expressão JS com `x` e `params` no escopo. Ex.: `params.s0 + params.v * x` */
  expressaoAvaliacao: string;
  insight: string;
  pontoDestaqueX: number;
}

export function materializarGrafico(g: GraficoSerializado): VisualizacaoGrafico {
  const body = g.expressaoAvaliacao.trim() || "0";
  // Expressões vêm de drafts aprovados no ingestor (admin).
  const fn = new Function("x", "params", `return (${body});`) as (
    x: number,
    params: Record<string, number>
  ) => number;

  return {
    id: g.id,
    formulaId: g.formulaId,
    nome: g.nome,
    eixosLabel: g.eixosLabel,
    expressao: g.expressao,
    grau: g.grau,
    area: g.area,
    eixoX: g.eixoX,
    eixoY: g.eixoY,
    parametros: g.parametros,
    avaliar: (x, params) => {
      try {
        const v = fn(x, params);
        return typeof v === "number" && Number.isFinite(v) ? v : NaN;
      } catch {
        return NaN;
      }
    },
    insight: g.insight,
    pontoDestaqueX: g.pontoDestaqueX,
  };
}
