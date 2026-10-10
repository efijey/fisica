import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import type {
  BlocoFolha,
  OperacaoFolha,
  RespostaTurnoMental,
} from "@/app/physics/problemas/mental/documento"
import { novoBlocoId } from "@/app/physics/problemas/mental/documento"
import {
  processarTurnoMock,
  resumoFormulasParaPrompt,
  schemaOperacoesHint,
  type PedidoTurnoMental,
} from "@/app/physics/problemas/mental/processar-turno"

/**
 * Schema achatado — OpenAI structured outputs:
 * - não aceita oneOf/discriminatedUnion
 * - exige todos os campos em `required` (usar nullable em vez de optional)
 */
const blocoFlatSchema = z.object({
  id: z.string(),
  tipo: z.enum(["paragrafo", "equacao", "nota"]),
  texto: z.string().nullable(),
  expressao: z.string().nullable(),
  formulaId: z.string().nullable(),
})

const operacaoFlatSchema = z.object({
  op: z.enum(["append", "replace", "rewrite", "remove", "move"]),
  id: z.string().nullable(),
  afterId: z.string().nullable(),
  texto: z.string().nullable(),
  expressao: z.string().nullable(),
  bloco: blocoFlatSchema.nullable(),
})

const respostaSchema = z.object({
  eco: z.string(),
  operacoes: z.array(operacaoFlatSchema),
  veredito: z.enum(["certo", "no_caminho", "desviado"]).nullable(),
})

function systemPrompt(): string {
  return `Você é o tutor de correção de uma mesa de cálculo mental (física, ensino médio).

A FOLHA já contém o que o aluno falou (parágrafos). Você NÃO escreve o raciocínio do aluno —
isso já foi para o papel via STT. Seu papel é avaliar e dar feedback.

Modos:
- ajuda: uma nota curta de orientação (não entregue a resposta final completa). veredito = null.
- corrigir: CORREÇÃO PARCIAL em tempo real. Compare enunciado × folha até agora.
  - SEMPRE preencha veredito:
    - "certo": caminho e resultado coerentes com o pedido (mesmo que incompleto em detalhes menores)
    - "no_caminho": raciocínio útil / direção certa, ainda incompleto ou com falha leve
    - "desviado": abordagem errada, fórmula inadequada ou contradição clara com o enunciado
  - Acrescente UMA nota breve (1–3 frases). Não aponte cada detalhe; seja leve.
  - NÃO reescreva nem apague os blocos do aluno.
- corrigir_fim: CORREÇÃO FINAL da sessão. Mesmas regras de veredito (obrigatório),
  feedback um pouco mais completo, ainda sem apagar a resolução do aluno.

${schemaOperacoesHint()}

Regras do JSON de operações (schema achatado):
- Prefira append de bloco tipo "nota" com o feedback.
- Só use rewrite/remove/move em casos excepcionais (quase nunca).
- Gere ids novos únicos para append (ex.: n1, n2).`
}

function normalizarBloco(
  raw: z.infer<typeof blocoFlatSchema>,
  fallbackId?: string
): BlocoFolha | null {
  const id = raw.id || fallbackId || novoBlocoId()
  if (raw.tipo === "paragrafo") {
    return { id, tipo: "paragrafo", texto: raw.texto ?? "" }
  }
  if (raw.tipo === "nota") {
    return { id, tipo: "nota", texto: raw.texto ?? "" }
  }
  if (raw.tipo === "equacao") {
    const expressao = raw.expressao ?? raw.texto ?? ""
    if (!expressao) return null
    return {
      id,
      tipo: "equacao",
      texto: raw.texto ?? undefined,
      expressao,
      formulaId: raw.formulaId ?? undefined,
    }
  }
  return null
}

function normalizarOperacoes(
  ops: z.infer<typeof operacaoFlatSchema>[]
): OperacaoFolha[] {
  const out: OperacaoFolha[] = []

  for (const op of ops) {
    if (op.op === "append") {
      if (!op.bloco) continue
      const bloco = normalizarBloco({
        ...op.bloco,
        id: op.bloco.id || novoBlocoId(),
      })
      if (bloco) out.push({ op: "append", bloco })
      continue
    }
    if (op.op === "replace") {
      if (!op.id || !op.bloco) continue
      const bloco = normalizarBloco({ ...op.bloco, id: op.id }, op.id)
      if (bloco) out.push({ op: "replace", id: op.id, bloco })
      continue
    }
    if (op.op === "rewrite") {
      if (!op.id || op.texto === null || op.texto === undefined) continue
      out.push({
        op: "rewrite",
        id: op.id,
        texto: op.texto,
        expressao: op.expressao ?? undefined,
      })
      continue
    }
    if (op.op === "remove") {
      if (!op.id) continue
      out.push({ op: "remove", id: op.id })
      continue
    }
    if (op.op === "move") {
      if (!op.id) continue
      out.push({
        op: "move",
        id: op.id,
        afterId: op.afterId ?? null,
      })
    }
  }

  return out
}

export type ResultadoProcessamento = RespostaTurnoMental & {
  erroLlm?: string
}

export async function processarTurnoMental(
  pedido: PedidoTurnoMental
): Promise<ResultadoProcessamento> {
  // Turno de fala: append local no cliente. Se chegar aqui, só espelha o texto.
  if (pedido.intencao === "turno") {
    return processarTurnoMock(pedido)
  }

  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    return processarTurnoMock(pedido)
  }

  const openai = createOpenAI({ apiKey: key })

  const userPayload = {
    intencao: pedido.intencao,
    problema: {
      id: pedido.problemaId,
      titulo: pedido.titulo,
      contexto: pedido.contexto,
      pergunta: pedido.pergunta,
    },
    formulasCatalogo: resumoFormulasParaPrompt(pedido.formulas),
    documentoAtual: pedido.documento,
    turnosConsumidos: pedido.turnosConsumidos,
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: respostaSchema,
      system: systemPrompt(),
      prompt: `Pedido de tutor (JSON):\n${JSON.stringify(userPayload, null, 2)}`,
    })

    let veredito = object.veredito ?? undefined
    if (
      (pedido.intencao === "corrigir" || pedido.intencao === "corrigir_fim") &&
      !veredito
    ) {
      veredito = "no_caminho"
    }

    return {
      eco: object.eco,
      operacoes: normalizarOperacoes(object.operacoes),
      veredito,
      fonte: "llm",
    }
  } catch (e) {
    const mensagem =
      e instanceof Error ? e.message : "Falha desconhecida no LLM"
    console.error("[mental/turno] LLM falhou, usando mock:", mensagem)
    return {
      ...processarTurnoMock(pedido),
      erroLlm: mensagem,
    }
  }
}
