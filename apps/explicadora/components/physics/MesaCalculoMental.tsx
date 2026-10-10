"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarraVoz } from "@/components/physics/BarraVoz"
import { FolhaResolucao } from "@/components/physics/FolhaResolucao"
import { criarSttClient } from "@/app/physics/problemas/mental/stt-client"
import {
  anexarFalaNaFolha,
  aplicarOperacoes,
  documentoVazio,
  type DocumentoFolha,
  type IntencaoMental,
  type RespostaTurnoMental,
} from "@/app/physics/problemas/mental/documento"
import {
  gravacaoDisponivel,
  iniciarGravacao,
  transcreverAudio,
  type SessaoGravacao,
} from "@/app/physics/problemas/mental/gravar-audio"
import {
  gravarWebSpeech,
  webSpeechDisponivel,
} from "@/app/physics/problemas/mental/web-speech-stt"
import type {
  ProblemaConceitual,
  Veredito as VereditoUI,
} from "@/app/physics/problemas/catalog"

const VEREDITO_STYLE: Record<
  VereditoUI,
  { label: string; className: string }
> = {
  certo: {
    label: "Certo",
    className: "bg-green-500/10 text-green-700 border-green-500/30",
  },
  no_caminho: {
    label: "No caminho",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  desviado: {
    label: "Desviado",
    className: "bg-red-500/10 text-red-700 border-red-500/30",
  },
}

type ModoStt = "whisper" | "webspeech" | "mock"

interface MesaCalculoMentalProps {
  problema: ProblemaConceitual
  onJulgado?: (certo: boolean) => void
}

async function chamarApiTutor(body: {
  problemaId: string
  titulo: string
  contexto: string
  pergunta: string
  formulas: string[]
  intencao: Exclude<IntencaoMental, "turno">
  documento: DocumentoFolha
  turnosConsumidos: number
}): Promise<RespostaTurnoMental & { llmAtivo?: boolean; erroLlm?: string }> {
  const res = await fetch("/api/mental/turno", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(
      typeof err.error === "string" ? err.error : "Falha ao processar correção"
    )
  }
  return res.json()
}

function detectarModoSttPreferido(): ModoStt {
  if (gravacaoDisponivel()) return "whisper"
  if (webSpeechDisponivel()) return "webspeech"
  return "mock"
}

export function MesaCalculoMental({
  problema,
  onJulgado,
}: MesaCalculoMentalProps) {
  const mockStt = useMemo(() => criarSttClient(problema.id), [problema.id])
  const [modoStt, setModoStt] = useState<ModoStt>("whisper")
  const sessaoRef = useRef<SessaoGravacao | null>(null)
  const pararWebSpeechRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    setModoStt(detectarModoSttPreferido())
  }, [])

  const [documento, setDocumento] = useState<DocumentoFolha>(documentoVazio)
  const [ouvindo, setOuvindo] = useState(false)
  const [pensando, setPensando] = useState(false)
  const [corrigirNoFim, setCorrigirNoFim] = useState(false)
  const [transcriptBruto, setTranscriptBruto] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [veredito, setVeredito] = useState<VereditoUI | null>(null)
  const [llmAtivo, setLlmAtivo] = useState<boolean | null>(null)
  const [turnosConsumidos, setTurnosConsumidos] = useState(0)
  const [tick, setTick] = useState(0)

  const ocupado = ouvindo || pensando
  const temMockRoteiro = mockStt.hasRoteiro()
  const turnosRestantes =
    modoStt === "mock" ? mockStt.turnosRestantes() : null
  void tick

  /** Fala → papel local. Sem LLM. */
  function escreverFalaNaFolha(transcript: string) {
    const { documento: proximo, texto } = anexarFalaNaFolha(documento, transcript)
    if (!texto) {
      setStatus("Nenhuma fala detectada.")
      return
    }
    setTranscriptBruto(texto)
    setDocumento(proximo)
    setTurnosConsumidos((n) => n + 1)
    if (modoStt === "mock") setTick((n) => n + 1)
    setStatus("Passo escrito na folha.")
  }

  async function gravarComWhisper() {
    if (ouvindo && sessaoRef.current) {
      setStatus("Transcrevendo sua fala…")
      try {
        const blob = await sessaoRef.current.parar()
        sessaoRef.current = null
        setOuvindo(false)
        if (blob.size < 256) {
          setStatus("Áudio muito curto. Fale um pouco mais e tente de novo.")
          return
        }
        const transcript = await transcreverAudio(blob)
        escreverFalaNaFolha(transcript)
      } catch (e) {
        sessaoRef.current = null
        setOuvindo(false)
        const msg = e instanceof Error ? e.message : "Falha na gravação/STT."
        if (
          webSpeechDisponivel() &&
          /OPENAI_API_KEY|503|STT|transcri/i.test(msg)
        ) {
          setStatus(`${msg} Tentando reconhecimento no navegador…`)
          setModoStt("webspeech")
          await gravarComWebSpeech()
          return
        }
        setStatus(msg)
      }
      return
    }

    setStatus("Gravando… clique de novo em Parar quando terminar.")
    setOuvindo(true)
    try {
      sessaoRef.current = await iniciarGravacao()
    } catch (e) {
      setOuvindo(false)
      sessaoRef.current = null
      const msg =
        e instanceof Error ? e.message : "Não foi possível acessar o microfone."
      if (webSpeechDisponivel()) {
        setStatus(`${msg} Tentando Web Speech…`)
        setModoStt("webspeech")
        await gravarComWebSpeech()
        return
      }
      setStatus(msg)
    }
  }

  async function gravarComWebSpeech() {
    if (ouvindo && pararWebSpeechRef.current) {
      pararWebSpeechRef.current()
      return
    }

    setOuvindo(true)
    setStatus("Ouvindo… fale agora (clique de novo para parar).")
    try {
      const { promise, parar } = gravarWebSpeech({
        lang: "pt-BR",
        timeoutMs: 20000,
      })
      pararWebSpeechRef.current = parar
      const { transcript } = await promise
      pararWebSpeechRef.current = null
      setOuvindo(false)
      escreverFalaNaFolha(transcript)
    } catch (e) {
      pararWebSpeechRef.current = null
      setOuvindo(false)
      setStatus(
        e instanceof Error
          ? e.message
          : "Falha no reconhecimento de voz do navegador."
      )
    }
  }

  async function gravarMock() {
    if (!temMockRoteiro) {
      setStatus(
        "Sem microfone/STT e sem roteiro de demonstração para este problema."
      )
      return
    }
    setOuvindo(true)
    setStatus("Demonstração (roteiro mock)…")
    try {
      const resultado = await mockStt.transcribe()
      setOuvindo(false)
      setTick((n) => n + 1)
      if (!resultado.turno) {
        setStatus("Roteiro mock esgotado.")
        return
      }
      escreverFalaNaFolha(resultado.transcript)
    } catch (e) {
      setOuvindo(false)
      setStatus(e instanceof Error ? e.message : "Erro no mock STT.")
    }
  }

  async function handleGravar() {
    if (pensando) return

    if (modoStt === "whisper") {
      await gravarComWhisper()
      return
    }
    if (modoStt === "webspeech") {
      await gravarComWebSpeech()
      return
    }
    await gravarMock()
  }

  async function pedirTutor(
    quando: "ajuda" | "corrigir" | "corrigir_fim"
  ) {
    if (ouvindo || pensando) return
    setPensando(true)
    setStatus(
      quando === "ajuda"
        ? "Consultando tutor…"
        : quando === "corrigir_fim"
          ? "Corrigindo sessão…"
          : "Checando o caminho…"
    )

    try {
      const docBase = documento
      const resposta = await chamarApiTutor({
        problemaId: problema.id,
        titulo: problema.titulo,
        contexto: problema.contexto,
        pergunta: problema.pergunta,
        formulas: problema.formulas,
        intencao: quando,
        documento: docBase,
        turnosConsumidos,
      })

      setLlmAtivo(resposta.fonte === "llm")
      setDocumento(aplicarOperacoes(docBase, resposta.operacoes))

      if (quando === "corrigir" || quando === "corrigir_fim") {
        const v = resposta.veredito ?? "no_caminho"
        setVeredito(v)
        onJulgado?.(v === "certo")
      }

      if (resposta.erroLlm && resposta.fonte !== "llm") {
        setStatus(`LLM falhou (${resposta.erroLlm}). Usando fallback.`)
      } else if (quando === "corrigir" && resposta.veredito) {
        setStatus(
          `Tag atualizada: ${VEREDITO_STYLE[resposta.veredito].label}. ${resposta.eco}`
        )
      } else {
        setStatus(resposta.eco || "Tutor respondeu.")
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erro no tutor.")
    } finally {
      setPensando(false)
    }
  }

  function handleReiniciar() {
    sessaoRef.current?.cancelar()
    sessaoRef.current = null
    pararWebSpeechRef.current?.()
    pararWebSpeechRef.current = null
    mockStt.reset()
    setDocumento(documentoVazio())
    setTranscriptBruto(null)
    setStatus(null)
    setVeredito(null)
    setCorrigirNoFim(false)
    setTurnosConsumidos(0)
    setOuvindo(false)
    setTick((n) => n + 1)
    setModoStt(detectarModoSttPreferido())
  }

  const bloqueadoSemTudo =
    modoStt === "mock" && !temMockRoteiro && !gravacaoDisponivel()

  if (bloqueadoSemTudo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resolver em voz</CardTitle>
          <p className="text-xs text-muted-foreground">
            Não foi possível gravar áudio neste navegador. Use Chrome/Edge com
            microfone e OPENAI_API_KEY configurada.
          </p>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">Mesa de cálculo mental</CardTitle>
            <Badge variant="outline" className="text-[10px] font-normal">
              Folha · voz
            </Badge>
            {veredito && (
              <Badge
                variant="outline"
                className={VEREDITO_STYLE[veredito].className}
              >
                {VEREDITO_STYLE[veredito].label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Grave o raciocínio — o texto vai direto para a folha. Contas e
            fórmulas faladas viram notação matemática. Use “Corrigir agora” para
            atualizar a tag (Certo / No caminho / Desviado).
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FolhaResolucao
            documento={documento}
            transcriptBruto={transcriptBruto}
          />
          <BarraVoz
            ouvindo={ouvindo}
            pensando={pensando}
            ocupado={ocupado}
            modoStt={modoStt}
            turnosRestantes={turnosRestantes}
            llmAtivo={llmAtivo}
            corrigirNoFim={corrigirNoFim}
            onGravar={handleGravar}
            onAjuda={() => pedirTutor("ajuda")}
            onCorrigir={() => pedirTutor("corrigir")}
            onToggleCorrigirNoFim={() => setCorrigirNoFim((v) => !v)}
            onCorrigirFim={() => pedirTutor("corrigir_fim")}
            onReiniciar={handleReiniciar}
          />
          {status && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {status}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
