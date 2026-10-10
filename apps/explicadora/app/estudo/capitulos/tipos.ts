import type { ExercicioTrilha } from "@/components/physics/ExercicioConceitual"

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
  exercicio?: ExercicioTrilha
}

/**
 * Pele de um mundo para uma seção. Definição, por quê, armadilhas e referência
 * nunca mudam; campo ausente cai na versão formal.
 */
export type LenteSecao = {
  intuicao?: string
  exemplo?: SecaoCapitulo["exemplo"]
  /** Sem `rubrica`, o juiz usa a da versão formal. */
  exercicio?: Omit<ExercicioTrilha, "rubrica"> & {
    rubrica?: ExercicioTrilha["rubrica"]
  }
}

export type LenteCapitulo = {
  mundoId: string
  nome: string
  /** Falso até o autor revisar; a página avisa que é rascunho. */
  revisado: boolean
  secoes: Record<string, LenteSecao>
}

export type Capitulo = {
  numero: number
  titulo: string
  resumo: string
  secoes: SecaoCapitulo[]
}
