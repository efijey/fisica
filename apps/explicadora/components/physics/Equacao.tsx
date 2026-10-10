import katex from "katex"
import "katex/dist/katex.min.css"

import { cn } from "@/lib/utils"

function renderizar(tex: string, bloco: boolean) {
  return katex.renderToString(tex, {
    displayMode: bloco,
    throwOnError: false,
    output: "htmlAndMathml",
  })
}

/** Equação em LaTeX. `bloco` centraliza em linha própria, como no livro. */
export function Equacao({
  tex,
  bloco = false,
  className,
}: {
  tex: string
  bloco?: boolean
  className?: string
}) {
  const Tag = bloco ? "div" : "span"
  return (
    <Tag
      className={cn(bloco && "my-3 overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: renderizar(tex, bloco) }}
    />
  )
}

type Trecho = { tipo: "texto" | "inline" | "bloco"; conteudo: string }

const DELIMITADORES = /\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g

export function separarTrechos(texto: string): Trecho[] {
  const trechos: Trecho[] = []
  let ultimo = 0
  for (const m of texto.matchAll(DELIMITADORES)) {
    if (m.index > ultimo) {
      trechos.push({ tipo: "texto", conteudo: texto.slice(ultimo, m.index) })
    }
    trechos.push(
      m[1] !== undefined
        ? { tipo: "bloco", conteudo: m[1].trim() }
        : { tipo: "inline", conteudo: m[2].trim() }
    )
    ultimo = m.index + m[0].length
  }
  if (ultimo < texto.length) {
    trechos.push({ tipo: "texto", conteudo: texto.slice(ultimo) })
  }
  return trechos
}

/** Texto com equações em `\( ... \)` (na linha) e `\[ ... \]` (em destaque). */
export function TextoComEquacoes({
  texto,
  className,
}: {
  texto: string
  className?: string
}) {
  return (
    <div className={className}>
      {separarTrechos(texto).map((t, i) =>
        t.tipo === "texto" ? (
          <span key={i}>{t.conteudo}</span>
        ) : (
          <Equacao key={i} tex={t.conteudo} bloco={t.tipo === "bloco"} />
        )
      )}
    </div>
  )
}
