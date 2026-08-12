import { NextResponse } from "next/server"
import { processarTurnoMental } from "@/app/physics/problemas/mental/llm-turno"
import type { PedidoTurnoMental } from "@/app/physics/problemas/mental/processar-turno"

export const runtime = "nodejs"

export async function POST(request: Request) {
  let body: PedidoTurnoMental
  try {
    body = (await request.json()) as PedidoTurnoMental
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (!body?.problemaId || !body?.intencao || !body?.documento) {
    return NextResponse.json(
      { error: "Campos obrigatórios: problemaId, intencao, documento" },
      { status: 400 }
    )
  }

  const resposta = await processarTurnoMental({
    ...body,
    turnosConsumidos: body.turnosConsumidos ?? 0,
    formulas: body.formulas ?? [],
    titulo: body.titulo ?? "",
    contexto: body.contexto ?? "",
    pergunta: body.pergunta ?? "",
  })

  return NextResponse.json({
    ...resposta,
    llmAtivo: Boolean(process.env.OPENAI_API_KEY?.trim()),
    // expõe erro só para diagnóstico no cliente (badge/status)
    erroLlm: "erroLlm" in resposta ? resposta.erroLlm : undefined,
  })
}
