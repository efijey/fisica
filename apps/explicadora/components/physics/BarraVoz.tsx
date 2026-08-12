"use client"

import { HelpCircle, Mic, RotateCcw, SpellCheck2, Flag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface BarraVozProps {
  ouvindo: boolean
  pensando: boolean
  ocupado: boolean
  modoStt: "webspeech" | "mock"
  turnosRestantes: number | null
  llmAtivo: boolean | null
  corrigirNoFim: boolean
  onGravar: () => void
  onAjuda: () => void
  onCorrigir: () => void
  onToggleCorrigirNoFim: () => void
  onCorrigirFim: () => void
  onReiniciar: () => void
}

export function BarraVoz({
  ouvindo,
  pensando,
  ocupado,
  modoStt,
  turnosRestantes,
  llmAtivo,
  corrigirNoFim,
  onGravar,
  onAjuda,
  onCorrigir,
  onToggleCorrigirNoFim,
  onCorrigirFim,
  onReiniciar,
}: BarraVozProps) {
  const micEsgotado =
    modoStt === "mock" && turnosRestantes !== null && turnosRestantes === 0

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="lg"
          onClick={onGravar}
          disabled={ocupado || micEsgotado}
          className={ouvindo ? "animate-pulse" : undefined}
        >
          <Mic data-icon="inline-start" />
          {ouvindo
            ? "Ouvindo…"
            : pensando
              ? "Escrevendo…"
              : modoStt === "webspeech"
                ? "Falar"
                : "Falar próximo passo"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAjuda}
          disabled={ocupado}
        >
          <HelpCircle data-icon="inline-start" />
          Pedir ajuda
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCorrigir}
          disabled={ocupado}
        >
          <SpellCheck2 data-icon="inline-start" />
          Corrigir agora
        </Button>

        <Button
          type="button"
          variant={corrigirNoFim ? "secondary" : "ghost"}
          size="sm"
          onClick={onToggleCorrigirNoFim}
          disabled={ocupado}
        >
          <Flag data-icon="inline-start" />
          {corrigirNoFim ? "Corrigir no fim: ligado" : "Corrigir no fim"}
        </Button>

        {corrigirNoFim && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onCorrigirFim}
            disabled={ocupado}
          >
            Encerrar e corrigir
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReiniciar}
          disabled={ocupado}
        >
          <RotateCcw data-icon="inline-start" />
          Reiniciar
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className="text-[10px] font-normal">
          {modoStt === "webspeech" ? "Web Speech" : "Mock STT"}
        </Badge>
        <Badge variant="outline" className="text-[10px] font-normal">
          {llmAtivo === null
            ? "Tutor…"
            : llmAtivo
              ? "LLM OpenAI"
              : "Tutor mock"}
        </Badge>
        {modoStt === "mock" && turnosRestantes !== null && (
          <span>
            {turnosRestantes === 0
              ? "Roteiro de fala esgotado"
              : `${turnosRestantes} turno${turnosRestantes === 1 ? "" : "s"} restante${turnosRestantes === 1 ? "" : "s"}`}
          </span>
        )}
        {modoStt === "webspeech" && (
          <span>Fale e solte — a folha atualiza com filtro leve.</span>
        )}
      </div>
    </div>
  )
}
