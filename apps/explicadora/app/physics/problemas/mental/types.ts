import type { Veredito } from "../catalog"

export type TipoPasso =
  | "fala"
  | "equacao"
  | "substituicao"
  | "resultado"
  | "nota_tutor"

export type IntencaoTurno =
  | "escrever_formula"
  | "passo_raciocinio"
  | "substituir"
  | "resultado"
  | "comando_generico"

export type QuandoTutor = "ajuda" | "corrigir" | "corrigir_fim"

export interface PassoResolucao {
  id: string
  tipo: TipoPasso
  texto: string
  expressao?: string
  formulaId?: string
  origem: "aluno" | "tutor" | "sistema"
  criadoEm: number
}

export interface TurnoVoz {
  id: string
  transcript: string
  intencao: IntencaoTurno
  formulaId?: string
  /** Expressão extra (ex.: Bhaskara) quando não há formulaId no catálogo */
  expressao?: string
  /** Texto opcional já formatado para passo de substituição/resultado */
  detalhe?: string
}

export interface RoteiroSttProblema {
  problemaId: string
  turnos: TurnoVoz[]
}

export interface CenarioTutor {
  quando: QuandoTutor
  /** Índice mínimo de turnos consumidos para liberar este cenário (opcional) */
  aposTurnos?: number
  mensagem: string
  veredito?: Veredito
  passosSugeridos?: Array<{
    tipo: TipoPasso
    texto: string
    expressao?: string
    formulaId?: string
  }>
}

export interface RoteiroTutorProblema {
  problemaId: string
  cenarios: CenarioTutor[]
}

export interface PedidoTutor {
  problemaId: string
  quando: QuandoTutor
  turnosConsumidos: number
  passos: PassoResolucao[]
}

export interface RespostaTutor {
  mensagem: string
  veredito?: Veredito
  passosSugeridos: PassoResolucao[]
}

export interface ResultadoStt {
  transcript: string
  turno: TurnoVoz | null
  esgotado: boolean
}

export interface SttClient {
  problemaId: string
  hasRoteiro(): boolean
  turnosRestantes(): number
  turnosConsumidos(): number
  reset(): void
  /** Simula push-to-talk: consome o próximo turno do roteiro. */
  transcribe(): Promise<ResultadoStt>
}

export interface TutorClient {
  problemaId: string
  hasRoteiro(): boolean
  avaliar(pedido: PedidoTutor): Promise<RespostaTutor>
}
