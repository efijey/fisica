"use client"

// src/components/physics/CardFormula.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ResultadoInferencia } from "@/app/physics/engine/inferencia";

const AREA_LABEL: Record<string, string> = {
  cinematica: "Cinemática",
  dinamica:   "Dinâmica",
  energia:    "Energia",
  momento:    "Momento",
  rotacao:    "Rotação",
  gravitacao: "Gravitação",
};

const AREA_COLOR: Record<string, string> = {
  cinematica: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  dinamica:   "bg-orange-500/10 text-orange-600 border-orange-500/20",
  energia:    "bg-green-500/10 text-green-600 border-green-500/20",
  momento:    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  rotacao:    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  gravitacao: "bg-red-500/10 text-red-600 border-red-500/20",
};

interface CardFormulaProps {
  resultado: ResultadoInferencia;
}

export function CardFormula({ resultado }: CardFormulaProps) {
  const { formula, variacaoAplicavel, podeCalcular } = resultado;

  return (
    <Card className="border hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {formula.nome}
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs shrink-0 ${AREA_COLOR[formula.area]}`}
          >
            {AREA_LABEL[formula.area]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">

        {/* Forma canônica — referência */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">
            Forma original
          </span>
          <div className="rounded-lg bg-muted px-4 py-2 text-center">
            <span className="font-mono text-sm text-muted-foreground">
              {formula.expressaoPrincipal}
            </span>
          </div>
        </div>

        {/* Variação aplicável — destaque */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wide text-primary font-medium">
            Isolando o que você precisa
          </span>
          <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-center">
            <span className="font-mono text-base font-bold tracking-wide text-primary">
              {variacaoAplicavel.expressao}
            </span>
          </div>
        </div>

        {formula.descricao && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {formula.descricao}
          </p>
        )}

        <Separator />

        {/* Variável que pode descobrir */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Você pode descobrir
          </span>
          <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 w-fit">
            <span className="font-mono text-sm font-bold text-primary">
              {podeCalcular.simbolo}
            </span>
            <span className="text-xs text-muted-foreground">
              {podeCalcular.nome}
            </span>
            <Badge variant="outline" className="text-[10px] ml-1">
              {podeCalcular.unidade}
            </Badge>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}