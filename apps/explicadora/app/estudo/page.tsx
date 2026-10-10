import type { Metadata } from "next"

import { TextoComEquacoes } from "@/components/physics/Equacao"

import { capitulo1 } from "./capitulos/capitulo-1"
import type { SecaoCapitulo } from "./capitulos/tipos"

export const metadata: Metadata = {
  title: "Trilha de Física 1 — Física",
}

function Bloco({ rotulo, texto }: { rotulo: string; texto: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {rotulo}
      </h3>
      <TextoComEquacoes texto={texto} className="leading-7" />
    </div>
  )
}

function Secao({ secao }: { secao: SecaoCapitulo }) {
  return (
    <section id={secao.id} className="flex flex-col gap-4 scroll-mt-8">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-semibold">{secao.titulo}</h2>
        <p className="text-xs text-muted-foreground">{secao.referencia}</p>
      </div>

      <Bloco rotulo="Intuição" texto={secao.intuicao} />
      <Bloco rotulo="Definição" texto={secao.definicao} />
      <Bloco rotulo="Por quê" texto={secao.porque} />

      <div className="flex flex-col gap-1 rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          Armadilhas
        </h3>
        <ul className="list-disc pl-5 flex flex-col gap-1">
          {secao.armadilhas.map((a, i) => (
            <li key={i}>
              <TextoComEquacoes texto={a} className="leading-7" />
            </li>
          ))}
        </ul>
      </div>

      {secao.exemplo && (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Exemplo resolvido
          </h3>
          <TextoComEquacoes
            texto={secao.exemplo.enunciado}
            className="leading-7 font-medium"
          />
          <TextoComEquacoes
            texto={secao.exemplo.resolucao}
            className="leading-7"
          />
        </div>
      )}
    </section>
  )
}

export default function PaginaEstudo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10">
        <header className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Trilha de Física 1</p>
          <h1 className="text-2xl font-bold tracking-tight">
            Capítulo {capitulo1.numero} — {capitulo1.titulo}
          </h1>
          <p className="leading-7">{capitulo1.resumo}</p>
          <nav className="flex flex-col gap-1 text-sm">
            {capitulo1.secoes.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {s.titulo}
              </a>
            ))}
          </nav>
        </header>

        {capitulo1.secoes.map((s) => (
          <Secao key={s.id} secao={s} />
        ))}
      </div>
    </div>
  )
}
