import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Ingestor de Exercícios</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Cole listas (texto ou PDF), pré-resolva com OpenAI, aprove propostas de
          catálogo e exporte para a explicadora.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/listas/nova"
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
        >
          Nova lista
        </Link>
        <Link
          href="/exercicios/novo"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-white"
        >
          Exercício único
        </Link>
        <Link
          href="/exercicios"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-white"
        >
          Exercícios
        </Link>
        <Link
          href="/catalogo/rascunhos"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-white"
        >
          Rascunhos de catálogo
        </Link>
      </div>
    </main>
  );
}
