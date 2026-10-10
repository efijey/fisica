/** Textos aceitam equações em `\( \)` (na linha) e `\[ \]` (em destaque). */
export type SecaoCapitulo = {
  id: string
  titulo: string
  /** Seção correspondente no Young & Freedman. */
  referencia: string
  intuicao: string
  definicao: string
  porque: string
  armadilhas: string[]
  exemplo?: { enunciado: string; resolucao: string }
}

export type Capitulo = {
  numero: number
  titulo: string
  resumo: string
  secoes: SecaoCapitulo[]
}
