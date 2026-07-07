"use client";
// src/components/physics/CardVariavel.tsx

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { VariavelFisica } from "@/app/physics/variables/catalog";

interface CardVariavelProps {
  variavel: VariavelFisica;
  selecionada: boolean;
  onToggle: (id: string) => void;
}

export function CardVariavel({ variavel, selecionada, onToggle }: CardVariavelProps) {
  return (
    <button
      onClick={() => onToggle(variavel.id)}
      className={cn(
        "w-full text-left rounded-xl border px-4 py-3 transition-all duration-200",
        "hover:shadow-md hover:border-primary/50",
        selecionada
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-bold leading-none text-primary">
            {variavel.simbolo}
          </span>
          <span className="text-sm font-medium text-foreground">
            {variavel.nome}
          </span>
        </div>
        <Badge variant={selecionada ? "default" : "outline"} className="text-xs shrink-0">
          {variavel.unidade}
        </Badge>
      </div>

      {selecionada && (
        <div className="mt-2 flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-xs text-primary font-medium">Selecionada</span>
        </div>
      )}
    </button>
  );
}