import type { Metadata } from "next"
import Link from "next/link"

import { TextoComEquacoes } from "@/components/physics/Equacao"
import { ExercicioConceitual } from "@/components/physics/ExercicioConceitual"
import { cn } from "@/lib/utils"

import { capitulo1 } from "./capitulos/capitulo-1"
import { lentesCapitulo1 } from "./capitulos/lentes"
import type { LenteCapitulo, LenteSecao, SecaoCapitulo } from "./capitulos/tipos"

export const metadata: Metadata = {
  title: "Trilha de Física 1 — Física",
}

function Rotulo({ texto, mundo }: { texto: string; mundo?: string }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {texto}
      {mundo && (
        <span className="ml-2 rounded bg-violet-500/10 px-1.5 py-0.5 text-[10px] text-violet-700 dark:text-violet-300">
          versão {mundo}
        </span>
      )}
    </h3>
  )
}

function Bloco({
  rotulo,
  texto,
  mundo,
}: {
  rotulo: string
  texto: string
  mundo?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <Rotulo texto={rotulo} mundo={mundo} />
      <TextoComEquacoes texto={texto} className="leading-7" />
    </div>
  )
}

function Secao({
  secao,
  pele,
  mundo,
}: {
  secao: SecaoCapitulo
  pele?: LenteSecao
  mundo?: string
}) {
  const intuicao = pele?.intuicao ?? secao.intuicao
  const exemplo = pele?.exemplo ?? secao.exemplo
  const exercicio =
    pele?.exercicio && secao.exercicio
      ? {
          ...pele.exercicio,
          rubrica: pele.exercicio.rubrica ?? secao.exercicio.rubrica,
          criterios: pele.exercicio.criterios ?? secao.exercicio.criterios,
        }
      : secao.exercicio

  return (
    <section id={secao.id} className="flex flex-col gap-4 scroll-mt-8">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-xl font-semibold">{secao.titulo}</h2>
        <p className="text-xs text-muted-foreground">{secao.referencia}</p>
      </div>

      <Bloco
        rotulo="Intuição"
        texto={intuicao}
        mundo={pele?.intuicao ? mundo : undefined}
      />
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

      {exemplo && (
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <Rotulo
            texto="Exemplo resolvido"
            mundo={pele?.exemplo ? mundo : undefined}
          />
          <TextoComEquacoes
            texto={exemplo.enunciado}
            className="leading-7 font-medium"
          />
          <TextoComEquacoes texto={exemplo.resolucao} className="leading-7" />
        </div>
      )}

      {exercicio && (
        <div className="flex flex-col gap-2 rounded-lg border border-primary/30 p-4">
          <Rotulo texto="Sua vez" mundo={pele?.exercicio ? mundo : undefined} />
          <ExercicioConceitual
            key={mundo ?? "formal"}
            exercicio={exercicio}
          />
        </div>
      )}
    </section>
  )
}

function SeletorMundo({ ativo }: { ativo?: LenteCapitulo }) {
  const opcoes = [
    { id: undefined, nome: "Formal" },
    ...lentesCapitulo1.map((l) => ({ id: l.mundoId, nome: l.nome })),
  ]
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-muted-foreground">Ler na versão:</span>
      {opcoes.map((o) => (
        <Link
          key={o.nome}
          href={o.id ? `/estudo?mundo=${o.id}` : "/estudo"}
          scroll={false}
          className={cn(
            "rounded-full border px-3 py-1",
            ativo?.mundoId === o.id
              ? "border-foreground bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {o.nome}
        </Link>
      ))}
    </div>
  )
}

export default async function PaginaEstudo({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { mundo } = await searchParams
  const lente = lentesCapitulo1.find((l) => l.mundoId === mundo)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">Trilha de Física 1</p>
          <h1 className="text-2xl font-bold tracking-tight">
            Capítulo {capitulo1.numero} — {capitulo1.titulo}
          </h1>
          <p className="leading-7">{capitulo1.resumo}</p>
          <SeletorMundo ativo={lente} />
          {lente && !lente.revisado && (
            <p className="rounded-lg border border-violet-500/30 bg-violet-500/5 px-3 py-2 text-sm">
              Versão {lente.nome} em rascunho: ainda não foi revisada. Muda só a
              intuição, os exemplos e os exercícios; definições, equações e
              armadilhas são as mesmas da versão formal.
            </p>
          )}
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
          <Secao
            key={s.id}
            secao={s}
            pele={lente?.secoes[s.id]}
            mundo={lente?.nome}
          />
        ))}
      </div>
    </div>
  )
}
