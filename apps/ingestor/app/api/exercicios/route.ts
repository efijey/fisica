import { NextResponse } from "next/server";
import { listarExercicios, salvarExercicioComAnalise } from "@/lib/db/exercises";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as
      | "rascunho"
      | "aprovado"
      | "rejeitado"
      | "publicado"
      | null;

    const exercicios = await listarExercicios(status ?? undefined);
    return NextResponse.json(exercicios);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar exercícios";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { enunciado, fonte } = body as { enunciado?: string; fonte?: string };

    if (!enunciado?.trim()) {
      return NextResponse.json({ error: "Enunciado é obrigatório" }, { status: 400 });
    }

    const resultado = await salvarExercicioComAnalise(enunciado.trim(), fonte);
    return NextResponse.json(resultado, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao salvar exercício";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
