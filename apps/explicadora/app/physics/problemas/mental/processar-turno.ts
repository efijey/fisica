import { catalogoFormulas } from "@fisica/physics-core"
import type {
  DocumentoFolha,
  IntencaoMental,
  OperacaoFolha,
  RespostaTurnoMental,
} from "./documento"
import { limparFalaAluno, novoBlocoId } from "./documento"
import { tutorParaOperacoesMock } from "./turno-para-ops"

export interface PedidoTurnoMental {
  problemaId: string
  titulo: string
  contexto: string
  pergunta: string
  formulas: string[]
  intencao: IntencaoMental
  transcript?: string
  documento: DocumentoFolha
  /** Quantos turnos de fala já ocorreram nesta sessão. */
  turnosConsumidos: number
}

/**
 * Fallback sem LLM.
 * Turno de fala normalmente nem chega aqui (append local no cliente).
 * Ajuda/correção: resposta genérica — sem gabarito por problema.
 */
export function processarTurnoMock(
  pedido: PedidoTurnoMental
): RespostaTurnoMental {
  if (
    pedido.intencao === "ajuda" ||
    pedido.intencao === "corrigir" ||
    pedido.intencao === "corrigir_fim"
  ) {
    return tutorParaOperacoesMock(
      pedido.problemaId,
      pedido.intencao,
      pedido.turnosConsumidos,
      pedido.documento
    )
  }

  const transcript = pedido.transcript?.trim() ?? ""
  if (!transcript) {
    return { eco: "", operacoes: [], fonte: "mock" }
  }

  const eco = limparFalaAluno(transcript)
  return {
    eco,
    operacoes: [
      {
        op: "append",
        bloco: { id: novoBlocoId("p"), tipo: "paragrafo", texto: eco },
      },
    ],
    fonte: "mock",
  }
}

export function resumoFormulasParaPrompt(formulaIds: string[]): string {
  return formulaIds
    .map((id) => {
      const f = catalogoFormulas.find((x) => x.id === id)
      if (!f) return `- ${id}`
      return `- id=${f.id} | ${f.nome} | ${f.expressaoPrincipal}`
    })
    .join("\n")
}

export function schemaOperacoesHint(): string {
  return `Responda SOMENTE JSON válido com o formato:
{
  "eco": "resumo curto do feedback (1 frase)",
  "operacoes": [
    { "op": "append", "bloco": { "id": "tmp1", "tipo": "nota", "texto": "feedback do tutor" } }
  ],
  "veredito": "certo" | "no_caminho" | "desviado"
}

Em ajuda, veredito pode ser null.
Em corrigir / corrigir_fim, veredito é OBRIGATÓRIO.
Prefira append de nota; não apague nem reescreva o raciocínio do aluno.`
}

export type { OperacaoFolha }
