import type { Veredito } from "../catalog"

export type BlocoFolha =
  | { id: string; tipo: "paragrafo"; texto: string }
  | {
      id: string
      tipo: "equacao"
      texto?: string
      expressao: string
      formulaId?: string
    }
  | { id: string; tipo: "nota"; texto: string }

export interface DocumentoFolha {
  blocos: BlocoFolha[]
  versao: number
}

export type OperacaoFolha =
  | { op: "append"; bloco: BlocoFolha }
  | { op: "replace"; id: string; bloco: BlocoFolha }
  | { op: "rewrite"; id: string; texto: string; expressao?: string }
  | { op: "remove"; id: string }
  | { op: "move"; id: string; afterId: string | null }

export type IntencaoMental =
  | "turno"
  | "ajuda"
  | "corrigir"
  | "corrigir_fim"

export interface RespostaTurnoMental {
  eco: string
  operacoes: OperacaoFolha[]
  veredito?: Veredito
  fonte: "llm" | "mock"
}

export function documentoVazio(): DocumentoFolha {
  return { blocos: [], versao: 0 }
}

let blocoSeq = 0

export function novoBlocoId(prefixo = "b"): string {
  blocoSeq += 1
  return `${prefixo}-${Date.now()}-${blocoSeq}`
}

export function aplicarOperacoes(
  doc: DocumentoFolha,
  operacoes: OperacaoFolha[]
): DocumentoFolha {
  let blocos = [...doc.blocos]

  for (const op of operacoes) {
    switch (op.op) {
      case "append": {
        const bloco = { ...op.bloco, id: op.bloco.id || novoBlocoId() }
        blocos.push(bloco)
        break
      }
      case "replace": {
        const i = blocos.findIndex((b) => b.id === op.id)
        if (i >= 0) blocos[i] = { ...op.bloco, id: op.id }
        break
      }
      case "rewrite": {
        const i = blocos.findIndex((b) => b.id === op.id)
        if (i < 0) break
        const atual = blocos[i]!
        if (atual.tipo === "equacao") {
          blocos[i] = {
            ...atual,
            texto: op.texto || atual.texto,
            expressao: op.expressao ?? atual.expressao,
          }
        } else if (atual.tipo === "paragrafo" || atual.tipo === "nota") {
          blocos[i] = { ...atual, texto: op.texto }
        }
        break
      }
      case "remove": {
        blocos = blocos.filter((b) => b.id !== op.id)
        break
      }
      case "move": {
        const i = blocos.findIndex((b) => b.id === op.id)
        if (i < 0) break
        const [item] = blocos.splice(i, 1)
        if (!item) break
        if (op.afterId === null) {
          blocos.unshift(item)
        } else {
          const j = blocos.findIndex((b) => b.id === op.afterId)
          if (j < 0) blocos.push(item)
          else blocos.splice(j + 1, 0, item)
        }
        break
      }
    }
  }

  return {
    blocos,
    versao: doc.versao + 1,
  }
}
