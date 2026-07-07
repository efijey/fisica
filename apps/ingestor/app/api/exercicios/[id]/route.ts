import { NextResponse } from "next/server";
import { atualizarStatusExercicio, obterExercicioCompleto } from "@/lib/db/exercises";
import type { ExerciseStatus } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const exercicio = await obterExercicioCompleto(id);

    if (!exercicio) {
      return NextResponse.json({ error: "Exercício não encontrado" }, { status: 404 });
    }

    return NextResponse.json(exercicio);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao buscar exercício";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body as { status?: ExerciseStatus };

    if (!status) {
      return NextResponse.json({ error: "Status é obrigatório" }, { status: 400 });
    }

    const exercicio = await atualizarStatusExercicio(id, status);
    return NextResponse.json(exercicio);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar exercício";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
