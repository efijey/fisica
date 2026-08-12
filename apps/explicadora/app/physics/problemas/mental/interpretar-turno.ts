import { catalogoFormulas } from "@fisica/physics-core"
import type { PassoResolucao, TurnoVoz } from "./types"

let passoSeq = 0

function novoId(prefixo: string): string {
  passoSeq += 1
  return `${prefixo}-${Date.now()}-${passoSeq}`
}

/**
 * Converte um turno de voz (mock ou futuro STT real) em passos do quadro.
 */
export function interpretarTurno(turno: TurnoVoz): PassoResolucao[] {
  const agora = Date.now()
  const passos: PassoResolucao[] = []

  passos.push({
    id: novoId("fala"),
    tipo: "fala",
    texto: turno.transcript,
    origem: "aluno",
    criadoEm: agora,
  })

  if (turno.intencao === "escrever_formula" && turno.formulaId) {
    const formula = catalogoFormulas.find((f) => f.id === turno.formulaId)
    passos.push({
      id: novoId("eq"),
      tipo: "equacao",
      texto: formula
        ? `Escrevendo: ${formula.nome}`
        : `Fórmula ${turno.formulaId}`,
      expressao: formula?.expressaoPrincipal ?? turno.expressao,
      formulaId: turno.formulaId,
      origem: "sistema",
      criadoEm: agora + 1,
    })
  }

  if (turno.intencao === "comando_generico") {
    passos.push({
      id: novoId("cmd"),
      tipo: "equacao",
      texto: turno.detalhe ?? "Comando reconhecido",
      expressao: turno.expressao,
      origem: "sistema",
      criadoEm: agora + 1,
    })
  }

  if (turno.intencao === "substituir") {
    passos.push({
      id: novoId("sub"),
      tipo: "substituicao",
      texto: turno.detalhe ?? turno.transcript,
      expressao: turno.expressao,
      origem: "aluno",
      criadoEm: agora + 1,
    })
  }

  if (turno.intencao === "resultado") {
    passos.push({
      id: novoId("res"),
      tipo: "resultado",
      texto: turno.detalhe ?? turno.transcript,
      expressao: turno.expressao ?? turno.detalhe,
      origem: "aluno",
      criadoEm: agora + 1,
    })
  }

  // passo_raciocinio: só a fala já cobre
  return passos
}

export function passoNotaTutor(
  mensagem: string,
  extras?: { expressao?: string; formulaId?: string }
): PassoResolucao {
  return {
    id: novoId("nota"),
    tipo: "nota_tutor",
    texto: mensagem,
    expressao: extras?.expressao,
    formulaId: extras?.formulaId,
    origem: "tutor",
    criadoEm: Date.now(),
  }
}
