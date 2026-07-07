import { analisarExercicio } from "@/lib/parser/analisar";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enunciado } = body as { enunciado?: string };

    if (!enunciado?.trim()) {
      return NextResponse.json({ error: "Enunciado é obrigatório" }, { status: 400 });
    }

    const analise = analisarExercicio(enunciado.trim());
    return NextResponse.json(analise);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro na análise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
