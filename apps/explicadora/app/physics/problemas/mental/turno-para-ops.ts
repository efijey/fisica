import {
  limparFalaAluno,
  novoBlocoId,
  type DocumentoFolha,
  type OperacaoFolha,
  type RespostaTurnoMental,
} from "./documento"

/**
 * Fallback de tutor sem API e sem gabarito por problema.
 * Só orienta de forma genérica; a correção real fica com o LLM.
 */
export function tutorParaOperacoesMock(
  _problemaId: string,
  quando: "ajuda" | "corrigir" | "corrigir_fim",
  _turnosConsumidos: number,
  documento?: DocumentoFolha
): RespostaTurnoMental {
  const vazio = !documento || documento.blocos.length === 0

  if (quando === "ajuda") {
    const texto = vazio
      ? "Comece falando o que o problema pede e qual grandeza você quer achar."
      : "Revise o enunciado e confira se as grandezas que você usou batem com o pedido."
    return {
      eco: texto,
      operacoes: [
        {
          op: "append",
          bloco: { id: novoBlocoId("n"), tipo: "nota", texto },
        },
      ],
      fonte: "mock",
    }
  }

  if (vazio) {
    const texto =
      "A folha ainda está em branco. Grave alguns passos antes de pedir correção."
    return {
      eco: texto,
      operacoes: [
        {
          op: "append",
          bloco: { id: novoBlocoId("n"), tipo: "nota", texto },
        },
      ],
      veredito: "desviado",
      fonte: "mock",
    }
  }

  const parcial = quando === "corrigir"
  const texto = parcial
    ? "Correção parcial (modo offline): continue desenvolvendo; com OPENAI_API_KEY a IA avalia o caminho com a tag Certo / No caminho / Desviado."
    : "Correção final (modo offline): defina OPENAI_API_KEY para a IA comparar enunciado e folha com feedback completo."

  const operacoes: OperacaoFolha[] = [
    {
      op: "append",
      bloco: { id: novoBlocoId("n"), tipo: "nota", texto },
    },
  ]

  return {
    eco: texto,
    operacoes,
    veredito: "no_caminho",
    fonte: "mock",
  }
}

/** @deprecated Preferir anexarFalaNaFolha no cliente. Mantido para fallback de API. */
export function transcriptParaOperacoesMock(
  transcript: string,
  _formulaIds: string[] = []
): RespostaTurnoMental {
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
