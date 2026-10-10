"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Draft {
  id: string;
  kind: string;
  proposed_id: string;
  payload: Record<string, unknown>;
  status: string;
  confidence: number;
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  rascunho: "Rascunho",
  aprovado: "Aprovado",
  rejeitado: "Rejeitado",
  publicado: "Publicado",
};

export default function CatalogoRascunhosPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [filtro, setFiltro] = useState("rascunho");
  const [erro, setErro] = useState<string | null>(null);
  const [selecionado, setSelecionado] = useState<Draft | null>(null);
  const [payloadEdit, setPayloadEdit] = useState("");
  const [loading, setLoading] = useState(false);

  function carregar() {
    const url = filtro
      ? `/api/catalogo/rascunhos?status=${filtro}`
      : "/api/catalogo/rascunhos";
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setErro(data.error);
        else {
          setErro(null);
          setDrafts(data);
        }
      })
      .catch(() => setErro("Falha ao carregar rascunhos"));
  }

  useEffect(() => {
    carregar();
  }, [filtro]);

  function abrir(d: Draft) {
    setSelecionado(d);
    setPayloadEdit(JSON.stringify(d.payload, null, 2));
  }

  async function atualizar(status: string) {
    if (!selecionado) return;
    setLoading(true);
    let payload: Record<string, unknown> | undefined;
    try {
      payload = JSON.parse(payloadEdit) as Record<string, unknown>;
    } catch {
      setErro("JSON do payload inválido");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/catalogo/rascunhos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selecionado.id,
        status,
        payload,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error);
      return;
    }
    setSelecionado(null);
    carregar();
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-sm text-zinc-500 hover:underline">
            ← Início
          </Link>
          <h1 className="text-xl font-bold mt-2">Rascunhos de catálogo</h1>
          <p className="text-sm text-zinc-600">
            Propostas da IA (áreas, fórmulas, grandezas, fenômenos, gráficos).
            Aprovar aqui; materializar com <code>npm run export-catalog</code>.
          </p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["rascunho", "aprovado", "rejeitado", "publicado", ""].map((s) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          {drafts.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => abrir(d)}
              className={`text-left rounded-xl border bg-white p-4 hover:shadow-sm ${
                selecionado?.id === d.id ? "ring-2 ring-zinc-900" : ""
              }`}
            >
              <div className="flex justify-between text-xs text-zinc-500 mb-1">
                <span className="uppercase">{d.kind}</span>
                <span>{STATUS_LABEL[d.status] ?? d.status}</span>
              </div>
              <p className="text-sm font-medium">{d.proposed_id}</p>
              <p className="text-xs text-zinc-500 mt-1">
                confiança {Math.round(d.confidence * 100)}%
              </p>
            </button>
          ))}
          {!erro && drafts.length === 0 && (
            <p className="text-sm text-zinc-500 py-8 text-center">
              Nenhum rascunho neste filtro.
            </p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4 min-h-80">
          {selecionado ? (
            <div className="flex flex-col gap-3 h-full">
              <div>
                <h2 className="font-semibold text-sm">{selecionado.proposed_id}</h2>
                <p className="text-xs text-zinc-500">{selecionado.kind}</p>
              </div>
              <textarea
                value={payloadEdit}
                onChange={(e) => setPayloadEdit(e.target.value)}
                className="flex-1 min-h-56 font-mono text-xs rounded-lg border p-3"
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => atualizar("aprovado")}
                  className="rounded-lg bg-green-700 text-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Aprovar
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => atualizar("rejeitado")}
                  className="rounded-lg bg-red-600 text-white px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Rejeitar
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => atualizar("rascunho")}
                  className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Voltar a rascunho
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Selecione um rascunho para revisar.</p>
          )}
        </div>
      </div>
    </main>
  );
}
