"use client"

import type { BlocoFolha, DocumentoFolha } from "@/app/physics/problemas/mental/documento"
import { cn } from "@/lib/utils"

interface FolhaResolucaoProps {
  documento: DocumentoFolha
  transcriptBruto?: string | null
  eco?: string | null
  className?: string
}

function BlocoView({ bloco }: { bloco: BlocoFolha }) {
  if (bloco.tipo === "paragrafo") {
    return (
      <p className="text-[15px] leading-relaxed text-foreground/90 animate-in fade-in duration-300">
        {bloco.texto}
      </p>
    )
  }

  if (bloco.tipo === "equacao") {
    return (
      <div className="my-3 animate-in fade-in duration-300">
        {bloco.texto && (
          <p className="text-xs text-muted-foreground mb-1">{bloco.texto}</p>
        )}
        <div className="rounded-md border border-dashed border-foreground/15 bg-muted/40 px-4 py-3 text-center">
          <span className="font-mono text-base font-semibold tracking-wide">
            {bloco.expressao}
          </span>
        </div>
      </div>
    )
  }

  return (
    <aside className="my-3 rounded-md border-l-2 border-amber-500/50 bg-amber-500/5 px-3 py-2 animate-in fade-in duration-300">
      <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700/80 mb-0.5">
        Tutor
      </p>
      <p className="text-sm leading-relaxed text-foreground/85">{bloco.texto}</p>
    </aside>
  )
}

export function FolhaResolucao({
  documento,
  transcriptBruto,
  eco,
  className,
}: FolhaResolucaoProps) {
  const vazio = documento.blocos.length === 0

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {(transcriptBruto || eco) && (
        <div className="flex flex-col gap-0.5 px-1">
          {transcriptBruto && (
            <p className="text-xs text-muted-foreground">
              Você disse:{" "}
              <span className="italic">“{transcriptBruto}”</span>
            </p>
          )}
          {eco && eco !== transcriptBruto && (
            <p className="text-xs text-muted-foreground">
              No papel: <span className="text-foreground/80">“{eco}”</span>
            </p>
          )}
        </div>
      )}

      <div
        className={cn(
          "relative min-h-[280px] rounded-sm border border-foreground/10",
          "bg-[color-mix(in_oklch,var(--card)_92%,oklch(0.97_0.01_85))]",
          "shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_rgb(0_0_0/0.06)]",
          "px-8 py-10 sm:px-12 sm:py-12"
        )}
      >
        {/* margem sutil tipo caderno */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-6 w-px bg-red-400/20 hidden sm:block"
        />

        {vazio ? (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-prose">
            Esta folha está em branco. Fale o próximo passo — a IA escreve aqui
            com um filtro leve, sem corrigir seu raciocínio até você pedir.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-w-prose">
            {documento.blocos.map((bloco) => (
              <BlocoView key={bloco.id} bloco={bloco} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
