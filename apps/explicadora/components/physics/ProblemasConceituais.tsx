"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { catalogoProblemas } from "@/app/physics/problemas/catalog"
import { CardProblema } from "@/components/physics/CardProblema"
import { PainelRespostaProblema } from "@/components/physics/PainelRespostaProblema"

export function ProblemasConceituais() {
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null)
  const [resolvidos, setResolvidos] = useState<Set<string>>(new Set())
  const [tentados, setTentados] = useState(0)

  const problema = useMemo(
    () => catalogoProblemas.find((p) => p.id === selecionadoId) ?? null,
    [selecionadoId]
  )

  const indiceAtual = problema
    ? catalogoProblemas.findIndex((p) => p.id === problema.id)
    : -1

  function handleJulgado(certo: boolean) {
    setTentados((n) => n + 1)
    if (certo && selecionadoId) {
      setResolvidos((prev) => new Set(prev).add(selecionadoId))
    }
  }

  function handleProximo() {
    if (indiceAtual < 0) return
    const proximo = catalogoProblemas[(indiceAtual + 1) % catalogoProblemas.length]
    setSelecionadoId(proximo.id)
  }

  if (problema) {
    return (
      <PainelRespostaProblema
        key={problema.id}
        problema={problema}
        onVoltar={() => setSelecionadoId(null)}
        onJulgado={handleJulgado}
        onProximo={handleProximo}
      />
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-tight">Problemas</h2>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Treine o que está na memória: leia a situação e explique como
            resolveria — sem fazer a conta. O juiz aponta se o raciocínio usa os
            conceitos certos.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Badge variant="outline" className="text-xs font-normal">
            {resolvidos.size} resolvido{resolvidos.size === 1 ? "" : "s"}
          </Badge>
          <Badge variant="outline" className="text-xs font-normal">
            {tentados} tentativa{tentados === 1 ? "" : "s"}
          </Badge>
        </div>
      </div>

      {catalogoProblemas.length === 0 ? (
        <div className="rounded-lg border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
          Nenhum problema disponível ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {catalogoProblemas.map((p) => (
            <CardProblema
              key={p.id}
              problema={p}
              onSelect={setSelecionadoId}
              resolvido={resolvidos.has(p.id)}
            />
          ))}
        </div>
      )}

      {resolvidos.size > 0 && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setResolvidos(new Set())
              setTentados(0)
            }}
          >
            Zerar progresso da sessão
          </Button>
        </div>
      )}
    </div>
  )
}
