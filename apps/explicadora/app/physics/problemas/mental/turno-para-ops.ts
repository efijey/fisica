import { catalogoFormulas } from "@fisica/physics-core"
import {
  novoBlocoId,
  type OperacaoFolha,
  type RespostaTurnoMental,
} from "./documento"
import type { TurnoVoz } from "./types"
import type { CenarioTutor, RoteiroTutorProblema } from "./types"
import tutorFixtures from "./fixtures/tutor-replies.json"

/** Converte um turno estruturado do fixture em operações da folha. */
export function turnoParaOperacoes(turno: TurnoVoz): RespostaTurnoMental {
  const operacoes: OperacaoFolha[] = []

  // Filtro suave mock: frase limpa a partir do transcript
  const eco = limparFala(turno.transcript)

  if (turno.intencao === "passo_raciocinio" || !precisaEquacao(turno)) {
    operacoes.push({
      op: "append",
      bloco: {
        id: novoBlocoId("p"),
        tipo: "paragrafo",
        texto: eco,
      },
    })
  } else if (
    turno.intencao === "escrever_formula" ||
    turno.intencao === "comando_generico"
  ) {
    operacoes.push({
      op: "append",
      bloco: {
        id: novoBlocoId("p"),
        tipo: "paragrafo",
        texto: eco,
      },
    })
    const formula = turno.formulaId
      ? catalogoFormulas.find((f) => f.id === turno.formulaId)
      : undefined
    operacoes.push({
      op: "append",
      bloco: {
        id: novoBlocoId("eq"),
        tipo: "equacao",
        texto: turno.detalhe ?? formula?.nome,
        expressao:
          formula?.expressaoPrincipal ?? turno.expressao ?? turno.detalhe ?? "",
        formulaId: turno.formulaId,
      },
    })
  } else if (turno.intencao === "substituir" || turno.intencao === "resultado") {
    operacoes.push({
      op: "append",
      bloco: {
        id: novoBlocoId("p"),
        tipo: "paragrafo",
        texto: eco,
      },
    })
    if (turno.detalhe || turno.expressao) {
      operacoes.push({
        op: "append",
        bloco: {
          id: novoBlocoId("eq"),
          tipo: "equacao",
          texto: turno.intencao === "resultado" ? "Resultado" : "Substituição",
          expressao: turno.expressao ?? turno.detalhe!,
        },
      })
    }
  }

  return { eco, operacoes, fonte: "mock" }
}

function precisaEquacao(turno: TurnoVoz): boolean {
  return (
    turno.intencao === "escrever_formula" ||
    turno.intencao === "comando_generico" ||
    turno.intencao === "substituir" ||
    turno.intencao === "resultado"
  )
}

function limparFala(texto: string): string {
  const t = texto.trim().replace(/\s+/g, " ")
  if (!t) return t
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/** Heurística quando só há transcript livre (Web Speech sem LLM). */
export function transcriptParaOperacoesMock(
  transcript: string,
  formulaIds: string[]
): RespostaTurnoMental {
  const eco = limparFala(transcript)
  const operacoes: OperacaoFolha[] = [
    {
      op: "append",
      bloco: {
        id: novoBlocoId("p"),
        tipo: "paragrafo",
        texto: eco,
      },
    },
  ]

  const lower = eco.toLowerCase()
  for (const id of formulaIds) {
    const formula = catalogoFormulas.find((f) => f.id === id)
    if (!formula) continue
    const nome = formula.nome.toLowerCase()
    const hit =
      lower.includes(nome) ||
      (id === "segunda_lei_newton" &&
        (lower.includes("segunda lei") ||
          lower.includes("newton") ||
          lower.includes("f = m"))) ||
      (id === "velocidade_media" &&
        (lower.includes("velocidade média") ||
          lower.includes("velocidade media") ||
          lower.includes("vm"))) ||
      (id === "mruv_velocidade_final" &&
        (lower.includes("mruv") || lower.includes("velocidade final")))

    if (hit) {
      operacoes.push({
        op: "append",
        bloco: {
          id: novoBlocoId("eq"),
          tipo: "equacao",
          texto: formula.nome,
          expressao: formula.expressaoPrincipal,
          formulaId: formula.id,
        },
      })
      break
    }
  }

  // Bhaskara genérico
  if (lower.includes("bhaskara") || lower.includes("báskara")) {
    operacoes.push({
      op: "append",
      bloco: {
        id: novoBlocoId("eq"),
        tipo: "equacao",
        texto: "Fórmula de Bhaskara",
        expressao: "x = (−b ± √(b² − 4ac)) / (2a)",
      },
    })
  }

  return { eco, operacoes, fonte: "mock" }
}

function escolherCenario(
  cenarios: CenarioTutor[],
  quando: "ajuda" | "corrigir" | "corrigir_fim",
  turnosConsumidos: number
): CenarioTutor | undefined {
  return cenarios
    .filter((c) => c.quando === quando)
    .filter((c) => (c.aposTurnos ?? 0) <= turnosConsumidos)
    .sort((a, b) => (b.aposTurnos ?? 0) - (a.aposTurnos ?? 0))[0]
}

export function tutorParaOperacoesMock(
  problemaId: string,
  quando: "ajuda" | "corrigir" | "corrigir_fim",
  turnosConsumidos: number
): RespostaTurnoMental {
  const roteiro = (tutorFixtures as RoteiroTutorProblema[]).find(
    (r) => r.problemaId === problemaId
  )

  if (!roteiro) {
    return {
      eco: "Tutor mock indisponível para este problema.",
      operacoes: [
        {
          op: "append",
          bloco: {
            id: novoBlocoId("n"),
            tipo: "nota",
            texto: "Roteiro do tutor ainda não disponível (mock).",
          },
        },
      ],
      fonte: "mock",
    }
  }

  const cenario = escolherCenario(roteiro.cenarios, quando, turnosConsumidos)
  if (!cenario) {
    return {
      eco: "Continue resolvendo na folha.",
      operacoes: [],
      fonte: "mock",
    }
  }

  const operacoes: OperacaoFolha[] = [
    {
      op: "append",
      bloco: {
        id: novoBlocoId("n"),
        tipo: "nota",
        texto: cenario.mensagem,
      },
    },
  ]

  for (const p of cenario.passosSugeridos ?? []) {
    if (p.expressao) {
      operacoes.push({
        op: "append",
        bloco: {
          id: novoBlocoId("eq"),
          tipo: "equacao",
          texto: p.texto,
          expressao: p.expressao,
          formulaId: p.formulaId,
        },
      })
    } else {
      operacoes.push({
        op: "append",
        bloco: {
          id: novoBlocoId("n"),
          tipo: "nota",
          texto: p.texto,
        },
      })
    }
  }

  return {
    eco: cenario.mensagem,
    operacoes,
    veredito: cenario.veredito,
    fonte: "mock",
  }
}
