"use client"

export type SessaoGravacao = {
  /** Para a gravação e devolve o blob de áudio. */
  parar: () => Promise<Blob>
  /** Aborta sem devolver áudio. */
  cancelar: () => void
}

function escolherMime(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined
  const candidatos = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ]
  return candidatos.find((t) => MediaRecorder.isTypeSupported(t))
}

export function gravacaoDisponivel(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== "undefined"
  )
}

/**
 * Inicia gravação do microfone (push-to-talk).
 * Chame `parar()` para obter o Blob e enviar ao STT.
 */
export async function iniciarGravacao(): Promise<SessaoGravacao> {
  if (!gravacaoDisponivel()) {
    throw new Error("Gravação de áudio indisponível neste navegador.")
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const mimeType = escolherMime()
  const recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream)

  const chunks: BlobPart[] = []
  let settleParar: ((blob: Blob) => void) | null = null
  let rejectParar: ((err: Error) => void) | null = null

  recorder.ondataavailable = (ev) => {
    if (ev.data.size > 0) chunks.push(ev.data)
  }

  recorder.onerror = () => {
    rejectParar?.(new Error("Erro na gravação de áudio."))
    settleParar = null
    rejectParar = null
  }

  recorder.onstop = () => {
    for (const track of stream.getTracks()) track.stop()
    const tipo = recorder.mimeType || mimeType || "audio/webm"
    const blob = new Blob(chunks, { type: tipo })
    settleParar?.(blob)
    settleParar = null
    rejectParar = null
  }

  recorder.start(250)

  return {
    parar: () =>
      new Promise<Blob>((resolve, reject) => {
        if (recorder.state === "inactive") {
          reject(new Error("Gravação já encerrada."))
          return
        }
        settleParar = resolve
        rejectParar = reject
        try {
          recorder.stop()
        } catch (e) {
          for (const track of stream.getTracks()) track.stop()
          reject(e instanceof Error ? e : new Error("Falha ao parar gravação."))
        }
      }),
    cancelar: () => {
      settleParar = null
      rejectParar = null
      try {
        if (recorder.state !== "inactive") recorder.stop()
      } catch {
        /* ignore */
      }
      for (const track of stream.getTracks()) track.stop()
    },
  }
}

export async function transcreverAudio(blob: Blob): Promise<string> {
  const form = new FormData()
  const tipo = blob.type || "audio/webm"
  const nome = tipo.includes("mp4") ? "fala.m4a" : "fala.webm"
  form.append("audio", blob, nome)

  const res = await fetch("/api/mental/stt", {
    method: "POST",
    body: form,
  })

  const data = (await res.json().catch(() => ({}))) as {
    transcript?: string
    error?: string
  }

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Falha ao transcrever áudio"
    )
  }

  const transcript = data.transcript?.trim() ?? ""
  if (!transcript) {
    throw new Error("Nenhuma fala detectada.")
  }
  return transcript
}
