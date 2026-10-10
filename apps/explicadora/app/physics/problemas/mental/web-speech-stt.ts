"use client"

export interface ResultadoWebSpeech {
  transcript: string
  confianca?: number
}

type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  continuous: boolean
  maxAlternatives: number
  start: () => void
  stop: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionEventLike = {
  resultIndex: number
  results: ArrayLike<
    ArrayLike<{ transcript: string; confidence: number }> & { isFinal?: boolean }
  >
}

function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function webSpeechDisponivel(): boolean {
  return getSpeechRecognitionCtor() !== null
}

/**
 * Push-to-talk: acumula resultados finais até `parar()` ou timeout.
 */
export function gravarWebSpeech(opts?: {
  lang?: string
  timeoutMs?: number
}): {
  promise: Promise<ResultadoWebSpeech>
  parar: () => void
} {
  const Ctor = getSpeechRecognitionCtor()
  if (!Ctor) {
    return {
      promise: Promise.reject(
        new Error("Web Speech API indisponível neste navegador.")
      ),
      parar: () => {},
    }
  }

  const recognition = new Ctor()
  recognition.lang = opts?.lang ?? "pt-BR"
  recognition.interimResults = true
  recognition.continuous = true
  recognition.maxAlternatives = 1

  let settled = false
  let finais = ""
  let parcial = ""
  let confianca = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let stopping = false

  const promise = new Promise<ResultadoWebSpeech>((resolve, reject) => {
    const finish = (transcript: string, conf?: number) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      const t = transcript.trim()
      if (!t) reject(new Error("Nenhuma fala detectada."))
      else resolve({ transcript: t, confianca: conf })
    }

    recognition.onresult = (event) => {
      let novosFinais = ""
      let ultimoParcial = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result || !result[0]) continue
        const alt = result[0]
        if ((result as { isFinal?: boolean }).isFinal) {
          novosFinais += alt.transcript
          confianca = alt.confidence
        } else {
          ultimoParcial = alt.transcript
        }
      }
      if (novosFinais) finais += novosFinais
      parcial = ultimoParcial
    }

    recognition.onerror = (event) => {
      if (settled) return
      // "aborted" / "no-speech" no fim voluntário: tenta o que já capturou
      if (stopping || event.error === "aborted" || event.error === "no-speech") {
        finish(`${finais}${parcial}`.trim(), confianca || undefined)
        return
      }
      settled = true
      if (timer) clearTimeout(timer)
      reject(new Error(`Erro no reconhecimento: ${event.error}`))
    }

    recognition.onend = () => {
      if (settled) return
      finish(`${finais}${parcial}`.trim(), confianca || undefined)
    }

    const timeoutMs = opts?.timeoutMs ?? 20000
    timer = setTimeout(() => {
      stopping = true
      try {
        recognition.stop()
      } catch {
        /* ignore */
      }
    }, timeoutMs)

    try {
      recognition.start()
    } catch (e) {
      settled = true
      if (timer) clearTimeout(timer)
      reject(e instanceof Error ? e : new Error("Falha ao iniciar microfone."))
    }
  })

  return {
    promise,
    parar: () => {
      stopping = true
      try {
        recognition.stop()
      } catch {
        /* ignore */
      }
    },
  }
}
