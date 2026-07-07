"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoExercicioPage() {
  const router = useRouter();
  const [enunciado, setEnunciado] = useState("");
  const [fonte, setFonte] = useState("");
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handlePreview() {
    setErro(null);
    const res = await fetch("/api/analisar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enunciado }),
    });
    const data = await res.json();
    if (!res.ok) setErro(data.error);
    else setPreview(data);
  }

  async function handleSalvar() {
    setLoading(true);
    setErro(null);

    const res = await fetch("/api/exercicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enunciado, fonte: fonte || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErro(data.error);
      return;
    }

    router.push(`/exercicios/${data.exercise.id}`);
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <Link href="/exercicios" className="text-sm text-zinc-500 hover:underline">
          ← Voltar
        </Link>
        <h1 className="text-xl font-bold mt-2">Novo exercício</h1>
        <p className="text-sm text-zinc-600">
          Cole o enunciado. O sistema cataloga fórmulas, variáveis e fenômenos automaticamente.
        </p>
      </div>

      <textarea
        value={enunciado}
        onChange={(e) => setEnunciado(e.target.value)}
        placeholder="Ex.: Um corpo com massa de 2 kg possui aceleração de 2 m/s². Qual a força?"
        className="w-full min-h-40 rounded-xl border p-4 text-sm"
      />

      <input
        value={fonte}
        onChange={(e) => setFonte(e.target.value)}
        placeholder="Fonte (opcional): ENEM 2024, livro X..."
        className="w-full rounded-lg border px-3 py-2 text-sm"
      />

      {erro && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {erro}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handlePreview}
          disabled={!enunciado.trim()}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Pré-visualizar análise
        </button>
        <button
          onClick={handleSalvar}
          disabled={!enunciado.trim() || loading}
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Salvar como rascunho"}
        </button>
      </div>

      {preview && (
        <div className="rounded-xl border bg-white p-4 text-sm flex flex-col gap-3">
          <h2 className="font-semibold">Pré-visualização (regras)</h2>
          <p>Confiança: {Math.round((preview.confidence as number) * 100)}%</p>
          <div>
            <span className="font-medium">Fórmulas: </span>
            {(preview.formulas as string[])?.join(", ") || "—"}
          </div>
          <div>
            <span className="font-medium">Variáveis: </span>
            {(preview.variaveis as string[])?.join(", ") || "—"}
          </div>
          <div>
            <span className="font-medium">Fenômenos: </span>
            {(preview.fenomenos as string[])?.join(", ") || "—"}
          </div>
          {preview.computedAnswer != null && (
            <p className="text-xs text-zinc-500">
              Validação interna: {String(preview.computedAnswer)} {String(preview.computedUnit)} (não vai para o estudante)
            </p>
          )}
        </div>
      )}
    </main>
  );
}
