import { NextResponse } from "next/server";
import {
  atualizarCatalogDraft,
  listarCatalogDrafts,
  obterCatalogDraft,
} from "@/lib/db/exercises";
import type { ExerciseStatus } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ExerciseStatus | null;
    const drafts = await listarCatalogDrafts(status ?? undefined);
    return NextResponse.json(drafts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar rascunhos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, payload, proposed_id } = body as {
      id?: string;
      status?: ExerciseStatus;
      payload?: Record<string, unknown>;
      proposed_id?: string;
    };

    if (!id) {
      return NextResponse.json({ error: "id é obrigatório" }, { status: 400 });
    }

    const existing = await obterCatalogDraft(id);
    if (!existing) {
      return NextResponse.json({ error: "Rascunho não encontrado" }, { status: 404 });
    }

    const updated = await atualizarCatalogDraft(id, {
      status,
      payload,
      proposed_id,
    });
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao atualizar rascunho";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
