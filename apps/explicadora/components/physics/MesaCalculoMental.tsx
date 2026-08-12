"use client"

import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarraVoz } from "@/components/physics/BarraVoz"
import { FolhaResolucao } from "@/components/physics/FolhaResolucao"
import { criarSttClient } from "@/app/physics/problemas/mental/stt-client"
import {
  aplicarOperacoes,
  documentoVazio,
  type DocumentoFolha,
  type IntencaoMental,
  type RespostaTurnoMental,
} from "@/app/physics/problemas/mental/documento"
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

interface MesaCalculoMentalProps {
  problema: ProblemaConceitual
  onJulgado?: (certo: boolean) => void
}

async function chamarApiTurno(body: {
  problemaId: string
  titulo: string
  contexto: string
  pergunta: string
  formulas: string[]
  intencao: IntencaoMental
  transcript?: string
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
      typeof err.error === "string" ? err.error : "Falha ao processar turno"
    )
  }
  return res.json()
}

export function MesaCalculoMental({
  problema,
  onJulgado,
}: MesaCalculoMentalProps) {
  const mockStt = useMemo(() => criarSttClient(problema.id), [problema.id])
  const [modoStt, setModoStt] = useState<"webspeech" | "mock">("mock")

  useEffect(() => {
    setModoStt(webSpeechDisponivel() ? "webspeech" : "mock")
  }, [])

  const [documento, setDocumento] = useState<DocumentoFolha>(documentoVazio)
  const [ouvindo, setOuvindo] = useState(false)
  const [pensando, setPensando] = useState(false)
  const [corrigirNoFim, setCorrigirNoFim] = useState(false)
  const [transcriptBruto, setTranscriptBruto] = useState<string | null>(null)
  const [eco, setEco] = useState<string | null>(null)
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

  async function processarTranscript(
    transcript: string,
    intencao: IntencaoMental = "turno"
  ) {
    setPensando(true)
    setStatus("Escrevendo na folha…")
    setTranscriptBruto(transcript)

    const docBase = documento

    try {
      const resposta = await chamarApiTurno({
        problemaId: problema.id,
        titulo: problema.titulo,
        contexto: problema.contexto,
        pergunta: problema.pergunta,
        formulas: problema.formulas,
        intencao,
        transcript,
        documento: docBase,
        turnosConsumidos,
      })

      setLlmAtivo(resposta.fonte === "llm")
      setEco(resposta.eco)
      setDocumento(aplicarOperacoes(docBase, resposta.operacoes))

      if (intencao === "turno") {
        setTurnosConsumidos((n) => n + 1)
        if (modoStt === "mock") setTick((n) => n + 1)
      }

      if (resposta.veredito) {
        setVeredito(resposta.veredito)
        onJulgado?.(resposta.veredito === "certo")
      }

      if (resposta.fonte === "llm") {
        setStatus("Folha atualizada pela IA.")
      } else if (resposta.erroLlm) {
        setStatus(`LLM falhou (${resposta.erroLlm}). Usando mock.`)
      } else {
        setStatus(
          "Folha atualizada (modo mock — defina OPENAI_API_KEY para LLM)."
        )
      }
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erro ao processar.")
    } finally {
      setPensando(false)
    }
  }

  async function handleGravar() {
    if (ocupado) return
    setVeredito(null)

    if (modoStt === "webspeech") {
      setOuvindo(true)
      setStatus("Ouvindo… fale agora.")
      try {
        const { promise } = gravarWebSpeech({ lang: "pt-BR", timeoutMs: 12000 })
        const { transcript } = await promise
        setOuvindo(false)
        await processarTranscript(transcript, "turno")
      } catch (e) {
        setOuvindo(false)
        setStatus(
          e instanceof Error
            ? e.message
            : "Falha no microfone. Tentando roteiro mock…"
        )
        // Fallback automático para mock se Web Speech falhar e houver roteiro
        if (temMockRoteiro && mockStt.turnosRestantes() > 0) {
          setModoStt("mock")
          await gravarMock()
        }
      }
      return
    }

    await gravarMock()
  }

  async function gravarMock() {
    if (!temMockRoteiro) {
      setStatus(
        "Sem Web Speech e sem roteiro mock para este problema. Use Chrome/Edge ou um problema com fixture."
      )
      return
    }
    setOuvindo(true)
    setStatus("Ouvindo (mock)…")
    try {
      const resultado = await mockStt.transcribe()
      setOuvindo(false)
      setTick((n) => n + 1)
      if (!resultado.turno) {
        setStatus("Roteiro mock esgotado.")
        return
      }
      await processarTranscript(resultado.transcript, "turno")
    } catch (e) {
      setOuvindo(false)
      setStatus(e instanceof Error ? e.message : "Erro no mock STT.")
    }
  }

  async function pedirTutor(
    quando: "ajuda" | "corrigir" | "corrigir_fim"
  ) {
    if (ocupado) return
    setPensando(true)
    setStatus(
      quando === "ajuda"
        ? "Consultando tutor…"
        : quando === "corrigir_fim"
          ? "Corrigindo sessão…"
          : "Corrigindo…"
    )

    try {
      const docBase = documento
      const resposta = await chamarApiTurno({
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
      setEco(resposta.eco)
      setDocumento(aplicarOperacoes(docBase, resposta.operacoes))

      if (resposta.veredito) {
        setVeredito(resposta.veredito)
        onJulgado?.(resposta.veredito === "certo")
      }

      if (resposta.erroLlm && resposta.fonte !== "llm") {
        setStatus(`LLM falhou (${resposta.erroLlm}). Usando mock.`)
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
    mockStt.reset()
    setDocumento(documentoVazio())
    setTranscriptBruto(null)
    setEco(null)
    setStatus(null)
    setVeredito(null)
    setCorrigirNoFim(false)
    setTurnosConsumidos(0)
    setTick((n) => n + 1)
    if (webSpeechDisponivel()) setModoStt("webspeech")
  }

  // Problemas sem fixture ainda funcionam com Web Speech + LLM/heurística
  const bloqueadoSemTudo = modoStt === "mock" && !temMockRoteiro

  if (bloqueadoSemTudo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resolver em voz</CardTitle>
          <p className="text-xs text-muted-foreground">
            Este navegador não tem Web Speech e não há roteiro mock para este
            problema. Use Chrome/Edge ou experimente “Caixa empurrada”, “Freada”
            ou “Velocidade média do ônibus”.
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
            Fale o raciocínio. A IA escreve na folha com filtro leve — erros
            podem ficar até você pedir correção.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <FolhaResolucao
            documento={documento}
            transcriptBruto={transcriptBruto}
            eco={eco}
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
