import { NextResponse } from "next/server"
import { gerarProblemaPersonalizado } from "@/app/physics/personalizado/gerar"

export const runtime = "nodejs"

export async function POST(request: Request) {
  let body: { mundoId?: string; cardId?: string }
  try {
    body = (await request.json()) as { mundoId?: string; cardId?: string }
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 })
  }

  if (!body.mundoId?.trim() || !body.cardId?.trim()) {
    return NextResponse.json(
      { error: "Campos obrigatórios: mundoId, cardId" },
      { status: 400 }
    )
  }

  const resultado = await gerarProblemaPersonalizado({
    mundoId: body.mundoId.trim(),
    cardId: body.cardId.trim(),
  })

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.erro }, { status: 400 })
  }

  return NextResponse.json({
    problema: resultado.problema,
    modelo: resultado.modelo,
    llmAtivo: Boolean(process.env.OPENAI_API_KEY?.trim()),
  })
}
