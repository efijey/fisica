import { NextResponse } from "next/server"

export const runtime = "nodejs"

const MAX_AUDIO_BYTES = 25 * 1024 * 1024

export async function POST(request: Request) {
  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY não configurada para STT." },
      { status: 503 }
    )
  }

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 })
  }

  const audio = form.get("audio")
  if (!audio || typeof audio === "string") {
    return NextResponse.json(
      { error: "Campo 'audio' obrigatório" },
      { status: 400 }
    )
  }

  if (audio.size === 0) {
    return NextResponse.json({ error: "Áudio vazio" }, { status: 400 })
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Áudio acima do limite (25 MB)" },
      { status: 413 }
    )
  }

  const tipo = audio.type || "audio/webm"
  const extensao = extensaoPorMime(tipo)
  const arquivo = new File([audio], `fala.${extensao}`, { type: tipo })

  const openaiForm = new FormData()
  openaiForm.append("file", arquivo)
  openaiForm.append("model", "whisper-1")
  openaiForm.append("language", "pt")
  openaiForm.append(
    "prompt",
    "Transcrição fiel em português do raciocínio de um aluno de física."
  )

  try {
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: openaiForm,
    })

    if (!res.ok) {
      const detalhe = await res.text().catch(() => "")
      console.error("[mental/stt] Whisper falhou:", res.status, detalhe)
      return NextResponse.json(
        { error: "Falha na transcrição do áudio." },
        { status: 502 }
      )
    }

    const data = (await res.json()) as { text?: string }
    const transcript = (data.text ?? "").trim()
    if (!transcript) {
      return NextResponse.json(
        { error: "Nenhuma fala detectada no áudio." },
        { status: 422 }
      )
    }

    return NextResponse.json({ transcript })
  } catch (e) {
    console.error("[mental/stt] erro:", e)
    return NextResponse.json(
      { error: "Erro ao contatar o serviço de STT." },
      { status: 502 }
    )
  }
}

function extensaoPorMime(mime: string): string {
  if (mime.includes("mp4") || mime.includes("m4a")) return "m4a"
  if (mime.includes("ogg")) return "ogg"
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3"
  if (mime.includes("wav")) return "wav"
  return "webm"
}
