"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovaListaPage() {
  const router = useRouter();
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<{
    total: number;
    exercicios: { id: string; propostas: number; metodo?: string }[];
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      let res: Response;
      if (arquivo) {
        const form = new FormData();
        form.set("titulo", titulo || arquivo.name);
        form.set("arquivo", arquivo);
        if (texto.trim()) form.set("texto", texto);
        res = await fetch("/api/listas", { method: "POST", body: form });
      } else {
        res = await fetch("/api/listas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ titulo: titulo || "Lista", texto }),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        setErro(data.error ?? "Falha ao ingerir lista");
        return;
      }

      setResultado({
        total: data.total,
        exercicios: data.exercicios,
      });
    } catch {
      setErro("Falha de rede ao enviar lista");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Início
        </Link>
        <h1 className="text-xl font-bold mt-2">Nova lista</h1>
        <p className="text-sm text-zinc-600">
          Cole vários enunciados ou envie um PDF. Cada exercício é separado,
          analisado (LLM se houver chave) e salvo como rascunho.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da lista"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Cole a lista completa aqui (opcional se enviar PDF)..."
          className="w-full min-h-48 rounded-xl border p-4 text-sm"
        />

        <label className="text-sm flex flex-col gap-1">
          <span className="font-medium">PDF (opcional)</span>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>

        {erro && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!texto.trim() && !arquivo)}
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm disabled:opacity-50 w-fit"
        >
          {loading ? "Processando..." : "Ingerir lista"}
        </button>
      </form>

      {resultado && (
        <div className="rounded-xl border bg-white p-4 text-sm flex flex-col gap-3">
          <p className="font-semibold">{resultado.total} exercício(s) criados</p>
          <ul className="list-disc pl-5 space-y-1">
            {resultado.exercicios.map((ex) => (
              <li key={ex.id}>
                <Link href={`/exercicios/${ex.id}`} className="underline">
                  {ex.id.slice(0, 8)}…
                </Link>
                {" — "}
                {ex.metodo ?? "?"}
                {ex.propostas > 0 ? ` · ${ex.propostas} proposta(s)` : ""}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.push("/exercicios")}
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Ver exercícios
            </button>
            <button
              type="button"
              onClick={() => router.push("/catalogo/rascunhos")}
              className="rounded-lg border px-3 py-1.5 text-sm"
            >
              Ver propostas de catálogo
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
