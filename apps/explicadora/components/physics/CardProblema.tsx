"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AREA_COLOR,
  AREA_LABEL,
  catalogoFenomenos,
} from "@fisica/physics-core"
import type { ProblemaConceitual } from "@/app/physics/problemas/catalog"

interface CardProblemaProps {
  problema: ProblemaConceitual
  onSelect: (id: string) => void
  resolvido?: boolean
}

function nomesFenomenos(ids: string[]): string[] {
  return ids.map((id) => {
    const f = catalogoFenomenos.find((item) => item.id === id)
    return f?.nome ?? id
  })
}

export function CardProblema({
  problema,
  onSelect,
  resolvido = false,
}: CardProblemaProps) {
  const fenomenos = nomesFenomenos(problema.fenomenos)

  return (
    <button
      type="button"
      onClick={() => onSelect(problema.id)}
      className="text-left w-full rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="border hover:shadow-md transition-shadow duration-200 h-full">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">
              {problema.titulo}
            </CardTitle>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge
                variant="outline"
                className={`text-xs capitalize ${AREA_COLOR[problema.area]}`}
              >
                {AREA_LABEL[problema.area]}
              </Badge>
              {resolvido && (
                <Badge variant="outline" className="text-[10px] text-green-700 border-green-500/30 bg-green-500/10">
                  Resolvido
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
            {problema.contexto}
          </p>
          {fenomenos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {fenomenos.map((nome) => (
                <Badge
                  key={nome}
                  variant="outline"
                  className="text-[10px] font-normal"
                >
                  {nome}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </button>
  )
}
