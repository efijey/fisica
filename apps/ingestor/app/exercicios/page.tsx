"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Exercise {
  id: string;
  enunciado: string;
  status: string;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  publicado: "Publicado",
};

export default function ExerciciosPage() {
  const [exercicios, setExercicios] = useState<Exercise[]>([]);
  const [filtro, setFiltro] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const url = filtro ? `/api/exercicios?status=${filtro}` : "/api/exercicios";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErro(data.error);
        else setExercicios(data);
      })
      .catch(() => setErro("Falha ao carregar exercícios"));
  }, [filtro]);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Exercícios catalogados</h1>
          <p className="text-sm text-zinc-600">Revise rascunhos antes de exportar.</p>
        </div>
        <Link
          href="/exercicios/novo"
          className="rounded-lg bg-zinc-900 text-white px-3 py-2 text-sm"
        >
          + Novo
        </Link>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["", "rascunho", "aprovado", "rejeitado", "publicado"].map((s) => (
          <button
            key={s || "todos"}
            onClick={() => setFiltro(s)}
            className={`rounded-full px-3 py-1 text-xs border ${
              filtro === s ? "bg-zinc-900 text-white border-zinc-900" : "bg-white"
            }`}
          >
            {s ? STATUS_LABEL[s] : "Todos"}
          </button>
        ))}
      </div>

      {erro && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {erro}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {exercicios.map((ex) => (
          <Link
            key={ex.id}
            href={`/exercicios/${ex.id}`}
            className="rounded-xl border bg-white p-4 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                {STATUS_LABEL[ex.status] ?? ex.status}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(ex.created_at).toLocaleDateString("pt-BR")}
              </span>
            </div>
            <p className="text-sm line-clamp-2">{ex.enunciado}</p>
          </Link>
        ))}

        {!erro && exercicios.length === 0 && (
          <p className="text-sm text-zinc-500 text-center py-12">
            Nenhum exercício encontrado.
          </p>
        )}
      </div>
    </main>
  );
}
