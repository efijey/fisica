// physics/engine/inferencia.ts

import { catalogoFormulas, Formula, VariacaoFormula } from '../formulas/catalog';
import { catalogoVariaveis, VariavelFisica } from '../variables/catalog';

export interface ResultadoInferencia {
  formula: Formula;
  variacaoAplicavel: VariacaoFormula;      // expressão já isolada na variável que falta
  podeCalcular: VariavelFisica;            // a variável que o usuário vai descobrir
}

export function inferirFormulas(
  variaveisDisponiveis: string[]
): ResultadoInferencia[] {
  const resultados: ResultadoInferencia[] = [];

  for (const formula of catalogoFormulas) {
    const faltando = formula.variaveis.filter(
      v => !variaveisDisponiveis.includes(v)
    );

    if (faltando.length !== 1) continue;

    const idFaltando = faltando[0];

    // Busca a variação que isola exatamente a variável que falta
    const variacao = formula.variacoes.find(v => v.isola === idFaltando);

    // Busca os metadados da variável no catálogo
    const variavel = catalogoVariaveis.find(v => v.id === idFaltando);

    if (!variacao || !variavel) continue;

    resultados.push({
      formula,
      variacaoAplicavel: variacao,
      podeCalcular: variavel,
    });
  }

  return resultados;
}

export function buscarVariavelPorId(id: string): VariavelFisica | undefined {
  return catalogoVariaveis.find(v => v.id === id);
}