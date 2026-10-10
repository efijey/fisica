import type { AreaFisica } from "@fisica/physics-core"
import type { RubricaProblema } from "@/app/physics/problemas/catalog"

/** Obra / trecho que ancora o conceito científico. */
export interface CitacaoLiteraria {
  id: string
  obra: string
  autores: string
  edicao?: string
  secao?: string
  paginas?: string
  url?: string
  licenca?: string
}

export interface CardLiteratura {
  id: string
  /** Título curto do conceito (para a UI). */
  conceito: string
  area: Extract<AreaFisica, "cinematica" | "dinamica">
  formulaIds: string[]
  variavelIds: string[]
  citacao: CitacaoLiteraria
  /** Trecho canônico — única base permitida para afirmações científicas na geração. */
  trecho: string
  /** Frase-guia do que o aluno deve conseguir explicar. */
  objetivoAprendizagem: string
  /** Rubrica do juiz: fixa por conceito para não depender do que a IA gerar. */
  rubrica: RubricaProblema
}

export interface FatoMundo {
  id: string
  /** Fato verificável do jogo/mundo (não inventar outros na geração). */
  texto: string
}

export interface MundoInteresse {
  id: string
  nome: string
  descricao: string
  /** Restrições: o modelo só pode usar estes fatos + metáforas genéricas do tema. */
  fatos: FatoMundo[]
  /** Entidades permitidas no enunciado. */
  entidades: string[]
}

export interface ProblemaPersonalizado {
  id: string
  criadoEm: string
  mundoId: string
  cardId: string
  titulo: string
  contexto: string
  pergunta: string
  /** Explicação curta do conceito, obrigatoriamente alinhada ao trecho. */
  explicacao: string
  formulaIds: string[]
  variavelIds: string[]
  citacao: CitacaoLiteraria
  rubrica: RubricaProblema
  dica: string
}
