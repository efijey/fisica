import { catalogoFormulas } from "@fisica/physics-core"
import type {
  DocumentoFolha,
  IntencaoMental,
  OperacaoFolha,
  RespostaTurnoMental,
} from "./documento"
import {
  transcriptParaOperacoesMock,
  tutorParaOperacoesMock,
  turnoParaOperacoes,
} from "./turno-para-ops"
import type { RoteiroSttProblema, TurnoVoz } from "./types"
import sttFixtures from "./fixtures/stt-turns.json"

export interface PedidoTurnoMental {
  problemaId: string
  titulo: string
  contexto: string
  pergunta: string
  formulas: string[]
  intencao: IntencaoMental
  transcript?: string
  documento: DocumentoFolha
  /** Quantos turnos de fala já ocorreram nesta sessão (para mock tutor). */
  turnosConsumidos: number
}

function encontrarTurnoPorTranscript(
  problemaId: string,
  transcript: string
): TurnoVoz | undefined {
  const roteiro = (sttFixtures as RoteiroSttProblema[]).find(
    (r) => r.problemaId === problemaId
  )
  if (!roteiro) return undefined
  const norm = transcript.trim().toLowerCase()
  return roteiro.turnos.find((t) => t.transcript.trim().toLowerCase() === norm)
}

function proximoTurnoFixture(
  problemaId: string,
  turnosConsumidos: number
): TurnoVoz | undefined {
  const roteiro = (sttFixtures as RoteiroSttProblema[]).find(
    (r) => r.problemaId === problemaId
  )
  return roteiro?.turnos[turnosConsumidos]
}

/** Processamento local sem LLM (fallback). */
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
      pedido.turnosConsumidos
    )
  }

  const transcript = pedido.transcript?.trim() ?? ""
  if (!transcript) {
    return {
      eco: "",
      operacoes: [],
      fonte: "mock",
    }
  }

  const porTexto = encontrarTurnoPorTranscript(pedido.problemaId, transcript)
  if (porTexto) return turnoParaOperacoes(porTexto)

  const porIndice = proximoTurnoFixture(
    pedido.problemaId,
    pedido.turnosConsumidos
  )
  // Se o transcript bate com o do índice (mock STT), usa estrutura
  if (
    porIndice &&
    porIndice.transcript.trim().toLowerCase() === transcript.toLowerCase()
  ) {
    return turnoParaOperacoes(porIndice)
  }

  return transcriptParaOperacoesMock(transcript, pedido.formulas)
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
  "eco": "frase limpa do que o aluno quis dizer",
  "operacoes": [
    { "op": "append", "bloco": { "id": "tmp1", "tipo": "paragrafo", "texto": "..." } },
    { "op": "append", "bloco": { "id": "tmp2", "tipo": "equacao", "texto": "nome", "expressao": "F = m · a", "formulaId": "segunda_lei_newton" } },
    { "op": "append", "bloco": { "id": "tmp3", "tipo": "nota", "texto": "ajuda do tutor" } },
    { "op": "rewrite", "id": "id-existente", "texto": "novo texto", "expressao": "opcional" },
    { "op": "remove", "id": "id-existente" },
    { "op": "replace", "id": "id-existente", "bloco": { "id": "id-existente", "tipo": "paragrafo", "texto": "..." } },
    { "op": "move", "id": "id-existente", "afterId": null }
  ],
  "veredito": "certo" | "no_caminho" | "desviado" | omitir
}`
}

export type { OperacaoFolha }
