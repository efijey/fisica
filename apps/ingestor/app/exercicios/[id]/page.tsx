"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ExercicioDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const [exercicio, setExercicio] = useState<Record<string, unknown> | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function carregar() {
    fetch(`/api/exercicios/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErro(data.error);
        else setExercicio(data);
      });
  }

  useEffect(() => {
    carregar();
  }, [id]);

  async function atualizarStatus(status: string) {
    setLoading(true);
    const res = await fetch(`/api/exercicios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading(false);
    if (res.ok) carregar();
    else {
      const data = await res.json();
      setErro(data.error);
    }
  }

  if (erro) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-red-600 text-sm">{erro}</p>
      </main>
    );
  }

  if (!exercicio) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-8">
        <p className="text-sm text-zinc-500">Carregando...</p>
      </main>
    );
  }

  const analysis = exercicio.analysis as Record<string, unknown> | undefined;

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <Link href="/exercicios" className="text-sm text-zinc-500 hover:underline">
          ← Voltar
        </Link>
        <div className="flex items-center gap-2 mt-2">
          <h1 className="text-xl font-bold">Detalhe do exercício</h1>
          <span className="text-xs rounded-full border px-2 py-0.5 uppercase">
            {String(exercicio.status)}
          </span>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4">
        <p className="text-sm leading-relaxed">{String(exercicio.enunciado)}</p>
      </div>

      {analysis && (
        <div className="rounded-xl border bg-white p-4 text-sm flex flex-col gap-2">
          <p>Confiança: {Math.round((analysis.confidence as number) * 100)}%</p>
          <p>Método: {String(analysis.resolver_method)}</p>
          {analysis.computed_answer != null && (
            <p className="text-zinc-500 text-xs">
              Validação interna: {String(analysis.computed_answer)} {String(analysis.computed_unit)}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <TagList title="Fórmulas" items={exercicio.formulas as string[]} />
        <TagList title="Variáveis" items={exercicio.variables as string[]} />
        <TagList title="Fenômenos" items={exercicio.phenomena as string[]} />
        <TagList title="Entidades" items={exercicio.entities as string[]} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          disabled={loading || exercicio.status === "aprovado"}
          onClick={() => atualizarStatus("aprovado")}
          className="rounded-lg bg-green-700 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          Aprovar
        </button>
        <button
          disabled={loading || exercicio.status === "rejeitado"}
          onClick={() => atualizarStatus("rejeitado")}
          className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          Rejeitar
        </button>
        <button
          disabled={loading || exercicio.status === "rascunho"}
          onClick={() => atualizarStatus("rascunho")}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Voltar para rascunho
        </button>
      </div>
    </main>
  );
}

function TagList({ title, items }: { title: string; items?: string[] }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-wrap gap-1">
        {items?.length ? (
          items.map((item) => (
            <span key={item} className="text-xs rounded-md bg-zinc-100 px-2 py-1">
              {item}
            </span>
          ))
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </div>
    </div>
  );
}
