import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Ingestor de Exercícios</h1>
        <p className="text-sm text-zinc-600 mt-1">
          Cole exercícios de física, cataloga fórmulas, variáveis e fenômenos — sem expor
          respostas numéricas ao estudante.
        </p>
      </div>

      <div className="flex gap-3">
        <Link
          href="/exercicios/novo"
          className="rounded-lg bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-zinc-800"
        >
          Novo exercício
        </Link>
        <Link
          href="/exercicios"
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-white"
        >
          Ver exercícios
        </Link>
      </div>
    </main>
  );
}
