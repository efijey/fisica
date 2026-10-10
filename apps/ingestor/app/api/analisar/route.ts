import { NextResponse } from "next/server";
import { analisarExercicioPreferindoLlm } from "@/lib/llm/analisar-exercicio";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enunciado } = body as { enunciado?: string };

    if (!enunciado?.trim()) {
      return NextResponse.json({ error: "Enunciado é obrigatório" }, { status: 400 });
    }

    const analise = await analisarExercicioPreferindoLlm(enunciado.trim());
    return NextResponse.json(analise);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro na análise";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
