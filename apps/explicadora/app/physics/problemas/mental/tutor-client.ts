import type {
  CenarioTutor,
  PassoResolucao,
  PedidoTutor,
  RespostaTutor,
  RoteiroTutorProblema,
  TutorClient,
} from "./types"
import tutorFixtures from "./fixtures/tutor-replies.json"

const DELAY_MS = 350

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function roteiroPorProblema(
  problemaId: string
): RoteiroTutorProblema | undefined {
  return (tutorFixtures as RoteiroTutorProblema[]).find(
    (r) => r.problemaId === problemaId
  )
}

function escolherCenario(
  cenarios: CenarioTutor[],
  quando: PedidoTutor["quando"],
  turnosConsumidos: number
): CenarioTutor | undefined {
  const candidatos = cenarios
    .filter((c) => c.quando === quando)
    .filter((c) => (c.aposTurnos ?? 0) <= turnosConsumidos)
    .sort((a, b) => (b.aposTurnos ?? 0) - (a.aposTurnos ?? 0))

  return candidatos[0]
}

function mapearPassosSugeridos(
  cenario: CenarioTutor
): PassoResolucao[] {
  const agora = Date.now()
  return (cenario.passosSugeridos ?? []).map((p, i) => ({
    id: `tutor-${cenario.quando}-${agora}-${i}`,
    tipo: p.tipo,
    texto: p.texto,
    expressao: p.expressao,
    formulaId: p.formulaId,
    origem: "tutor" as const,
    criadoEm: agora + i,
  }))
}

export class MockTutorClient implements TutorClient {
  readonly problemaId: string
  private readonly roteiro: RoteiroTutorProblema | undefined

  constructor(problemaId: string) {
    this.problemaId = problemaId
    this.roteiro = roteiroPorProblema(problemaId)
  }

  hasRoteiro(): boolean {
    return Boolean(this.roteiro && this.roteiro.cenarios.length > 0)
  }

  async avaliar(pedido: PedidoTutor): Promise<RespostaTutor> {
    await sleep(DELAY_MS)

    if (!this.roteiro) {
      return {
        mensagem:
          "Roteiro do tutor ainda não disponível para este problema (mock).",
        passosSugeridos: [],
      }
    }

    const cenario = escolherCenario(
      this.roteiro.cenarios,
      pedido.quando,
      pedido.turnosConsumidos
    )

    if (!cenario) {
      return {
        mensagem: "Sem feedback mock para este momento — continue gravando.",
        passosSugeridos: [],
      }
    }

    return {
      mensagem: cenario.mensagem,
      veredito: cenario.veredito,
      passosSugeridos: mapearPassosSugeridos(cenario),
    }
  }
}

export function criarTutorClient(problemaId: string): TutorClient {
  return new MockTutorClient(problemaId)
}
