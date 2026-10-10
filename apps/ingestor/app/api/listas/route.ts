import { NextResponse } from "next/server";
import {
  criarLista,
  salvarExercicioComAnalise,
  listarListas,
  uploadPdfLista,
} from "@/lib/db/exercises";
import { dividirListaEmEnunciados } from "@/lib/llm/analisar-exercicio";
import { extrairTextoPdf } from "@/lib/pdf/extrair-texto";

export async function GET() {
  try {
    const listas = await listarListas();
    return NextResponse.json(listas);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao listar listas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    let titulo = "Lista sem título";
    let fonte: "texto" | "pdf" = "texto";
    let rawText = "";
    let storagePath: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      titulo = String(form.get("titulo") ?? titulo);
      const file = form.get("arquivo");
      const texto = form.get("texto");

      if (file instanceof File && file.size > 0) {
        fonte = "pdf";
        const bytes = await file.arrayBuffer();
        try {
          storagePath = await uploadPdfLista(file.name || "lista.pdf", bytes);
        } catch (err) {
          console.warn("[ingestor] upload PDF falhou (bucket ausente?):", err);
        }
        rawText = await extrairTextoPdf(bytes);
      } else if (typeof texto === "string" && texto.trim()) {
        fonte = "texto";
        rawText = texto.trim();
      } else {
        return NextResponse.json(
          { error: "Envie um PDF ou texto da lista" },
          { status: 400 }
        );
      }
    } else {
      const body = await request.json();
      titulo = body.titulo?.trim() || titulo;
      rawText = String(body.texto ?? "").trim();
      fonte = "texto";
      if (!rawText) {
        return NextResponse.json({ error: "Texto da lista é obrigatório" }, { status: 400 });
      }
    }

    if (!rawText.trim()) {
      return NextResponse.json(
        { error: "Não foi possível extrair texto da lista" },
        { status: 400 }
      );
    }

    const lista = await criarLista({
      titulo,
      fonte,
      rawText,
      storagePath,
    });

    const enunciados = await dividirListaEmEnunciados(rawText);
    const criados = [];

    for (const enunciado of enunciados) {
      const resultado = await salvarExercicioComAnalise(enunciado, titulo, {
        listId: lista.id,
      });
      criados.push({
        id: resultado.exercise.id,
        titulo: resultado.exercise.titulo,
        propostas: resultado.analise?.propostas?.length ?? 0,
        metodo: resultado.analise?.resolverMethod,
      });
    }

    return NextResponse.json(
      {
        lista,
        total: criados.length,
        exercicios: criados,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao ingerir lista";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
