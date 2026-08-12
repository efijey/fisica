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
  return `Você é um assistente de mesa de cálculo mental para física (ensino médio).
O aluno fala; você escreve/atualiza uma FOLHA de resolução (documento de blocos).

Filtro SUAVE:
- Limpe balbucios e forme uma frase clara (campo "eco").
- NÃO corrija o raciocínio físico no modo "turno" — o aluno pode errar e o erro pode ficar no papel.
- Só escreva equação do catálogo se o aluno pedir claramente uma fórmula.
- Use append na maioria dos casos; rewrite/remove/move quando precisar reorganizar.

Modos:
- turno: interpretar a fala e atualizar a folha.
- ajuda: nota curta de orientação (sem entregar a resposta numérica completa).
- corrigir / corrigir_fim: avaliar o documento; pode acrescentar nota e veredito.

${schemaOperacoesHint()}

Regras do JSON de operações (schema achatado):
- append/replace: preencha "bloco" com id, tipo e campos do tipo.
- paragrafo/nota: use bloco.texto
- equacao: use bloco.expressao (obrigatório) e bloco.texto/formulaId opcionais
- rewrite: preencha "id" + "texto" (+ expressao se equacao)
- remove: preencha "id"
- move: preencha "id" + "afterId" (null = início)

Gere ids novos únicos para blocos append (ex.: b1, b2).`
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
    transcript: pedido.transcript ?? null,
    documentoAtual: pedido.documento,
    turnosConsumidos: pedido.turnosConsumidos,
  }

  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: respostaSchema,
      system: systemPrompt(),
      prompt: `Pedido do aluno (JSON):\n${JSON.stringify(userPayload, null, 2)}`,
    })

    return {
      eco: object.eco,
      operacoes: normalizarOperacoes(object.operacoes),
      veredito: object.veredito ?? undefined,
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
