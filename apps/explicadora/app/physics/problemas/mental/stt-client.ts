import type {
  ResultadoStt,
  RoteiroSttProblema,
  SttClient,
  TurnoVoz,
} from "./types"
import sttFixtures from "./fixtures/stt-turns.json"

const DELAY_MS = 400

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function roteiroPorProblema(problemaId: string): RoteiroSttProblema | undefined {
  return (sttFixtures as RoteiroSttProblema[]).find(
    (r) => r.problemaId === problemaId
  )
}

export class MockSttClient implements SttClient {
  readonly problemaId: string
  private indice = 0
  private readonly turnos: TurnoVoz[]

  constructor(problemaId: string) {
    this.problemaId = problemaId
    this.turnos = roteiroPorProblema(problemaId)?.turnos ?? []
  }

  hasRoteiro(): boolean {
    return this.turnos.length > 0
  }

  turnosRestantes(): number {
    return Math.max(0, this.turnos.length - this.indice)
  }

  turnosConsumidos(): number {
    return this.indice
  }

  reset(): void {
    this.indice = 0
  }

  async transcribe(): Promise<ResultadoStt> {
    await sleep(DELAY_MS)

    if (this.indice >= this.turnos.length) {
      return {
        transcript: "",
        turno: null,
        esgotado: true,
      }
    }

    const turno = this.turnos[this.indice]!
    this.indice += 1

    return {
      transcript: turno.transcript,
      turno,
      esgotado: this.indice >= this.turnos.length,
    }
  }
}

export function criarSttClient(problemaId: string): SttClient {
  return new MockSttClient(problemaId)
}
