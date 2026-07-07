"use client";

// src/components/physics/ListaFormulas.tsx

import { Separator } from "@/components/ui/separator";
import { CardFormula } from "./CardFormula";
import type { ResultadoInferencia, AreaFisica } from "@fisica/physics-core";

const AREA_LABEL: Record<AreaFisica, string> = {
  cinematica: "Cinemática",
  dinamica:   "Dinâmica",
  energia:    "Energia",
  momento:    "Momento",
  rotacao:    "Rotação",
  gravitacao: "Gravitação",
};

interface ListaFormulasProps {
  resultados: ResultadoInferencia[];
  variaveisSelecionadas: string[];
}

export function ListaFormulas({ resultados, variaveisSelecionadas }: ListaFormulasProps) {
  // Agrupa por área
  const porArea = resultados.reduce<Partial<Record<AreaFisica, ResultadoInferencia[]>>>(
    (acc, resultado) => {
      const area = resultado.formula.area;
      if (!acc[area]) acc[area] = [];
      acc[area]!.push(resultado);
      return acc;
    },
    {}
  );

  const areas = Object.keys(porArea) as AreaFisica[];

  // Estado vazio — nenhuma variável selecionada
  if (variaveisSelecionadas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-4xl">🔭</span>
        <p className="text-base font-medium text-foreground">
          Selecione as variáveis que você tem
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          O sistema vai mostrar quais fórmulas você consegue aplicar com base no que você conhece do problema.
        </p>
      </div>
    );
  }

  // Estado vazio — variáveis selecionadas mas sem fórmulas
  if (resultados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <span className="text-4xl">🤔</span>
        <p className="text-base font-medium text-foreground">
          Nenhuma fórmula encontrada
        </p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Com as variáveis selecionadas, nenhuma fórmula pode ser aplicada diretamente.
          Tente adicionar mais uma variável.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Fórmulas possíveis</h2>
        <span className="text-sm text-muted-foreground">
          {resultados.length} {resultados.length === 1 ? "fórmula encontrada" : "fórmulas encontradas"}
        </span>
      </div>

      {areas.map((area, index) => (
        <div key={area} className="flex flex-col gap-3">
          {index > 0 && <Separator />}

          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            {AREA_LABEL[area]}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {porArea[area]!.map(resultado => (
              <CardFormula key={resultado.formula.id} resultado={resultado} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}