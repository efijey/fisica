"use client"

import { Badge } from "@/components/ui/badge"
import type { PassoResolucao, TipoPasso } from "@/app/physics/problemas/mental/types"
import { cn } from "@/lib/utils"

const TIPO_LABEL: Record<TipoPasso, string> = {
  fala: "Fala",
  equacao: "Equação",
  substituicao: "Substituição",
  resultado: "Resultado",
  nota_tutor: "Tutor",
}

const TIPO_STYLE: Record<TipoPasso, string> = {
  fala: "border-border",
  equacao: "border-blue-500/30 bg-blue-500/5",
  substituicao: "border-violet-500/30 bg-violet-500/5",
  resultado: "border-green-500/30 bg-green-500/5",
  nota_tutor: "border-amber-500/30 bg-amber-500/5",
}

interface QuadroPassosProps {
  passos: PassoResolucao[]
  vazio?: string
}

export function QuadroPassos({
  passos,
  vazio = "O quadro está vazio. Toque no microfone para falar o primeiro passo.",
}: QuadroPassosProps) {
  if (passos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
        {vazio}
      </div>
    )
  }

  return (
    <ol className="flex flex-col gap-2">
      {passos.map((passo, index) => (
        <li
          key={passo.id}
          className={cn(
            "rounded-lg border px-3 py-2.5 flex flex-col gap-1.5",
            TIPO_STYLE[passo.tipo]
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {index + 1}.
            </span>
            <Badge variant="outline" className="text-[10px] font-normal">
              {TIPO_LABEL[passo.tipo]}
            </Badge>
            {passo.origem === "tutor" && (
              <span className="text-[10px] text-amber-700">IA</span>
            )}
          </div>
          <p className="text-sm leading-relaxed">{passo.texto}</p>
          {passo.expressao && (
            <div className="rounded-md bg-muted/80 px-3 py-2 text-center">
              <span className="font-mono text-sm font-semibold tracking-wide">
                {passo.expressao}
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}
