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
  results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }> & { isFinal?: boolean }>
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
 * Push-to-talk: inicia reconhecimento e resolve no primeiro resultado final
 * ou ao chamar stop (via timeout de silêncio / end).
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
      promise: Promise.reject(new Error("Web Speech API indisponível neste navegador.")),
      parar: () => {},
    }
  }

  const recognition = new Ctor()
  recognition.lang = opts?.lang ?? "pt-BR"
  recognition.interimResults = true
  recognition.continuous = false
  recognition.maxAlternatives = 1

  let settled = false
  let parcial = ""
  let timer: ReturnType<typeof setTimeout> | null = null

  const promise = new Promise<ResultadoWebSpeech>((resolve, reject) => {
    const finish = (transcript: string, confianca?: number) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      const t = transcript.trim()
      if (!t) reject(new Error("Nenhuma fala detectada."))
      else resolve({ transcript: t, confianca })
    }

    recognition.onresult = (event) => {
      let finalText = ""
      let confidence = 0
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i]
        if (!result || !result[0]) continue
        const alt = result[0]
        if ((result as { isFinal?: boolean }).isFinal) {
          finalText += alt.transcript
          confidence = alt.confidence
        } else {
          parcial = alt.transcript
        }
      }
      if (finalText) finish(finalText, confidence)
    }

    recognition.onerror = (event) => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      reject(new Error(`Erro no reconhecimento: ${event.error}`))
    }

    recognition.onend = () => {
      if (settled) return
      finish(parcial)
    }

    const timeoutMs = opts?.timeoutMs ?? 12000
    timer = setTimeout(() => {
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
      try {
        recognition.stop()
      } catch {
        /* ignore */
      }
    },
  }
}
