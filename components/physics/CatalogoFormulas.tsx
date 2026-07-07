"use client"

// src/components/physics/CatalogoFormulas.tsx

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { catalogoFormulas, type AreaFisica, type Formula } from "@/app/physics/formulas/catalog";
import { catalogoVariaveis } from "@/app/physics/variables/catalog";
import { obterMetadadosFormula } from "@/app/physics/formulas/metadata";
import { obterFenomenosPorFormula } from "@/app/physics/engine/conexoes";
import { AREAS_NAVEGACAO, AREA_COLOR } from "@/lib/physics/areas";

const AREAS = AREAS_NAVEGACAO;

function resolverNomeVariavel(id: string): string {
  const found = catalogoVariaveis.find(v => v.id === id);
  return found ? `${found.simbolo} — ${found.nome}` : id;
}

function CardCatalogo({ formula }: { formula: Formula }) {
  const metadados = obterMetadadosFormula(formula.id);
  const fenomenos = obterFenomenosPorFormula(formula.id);

  return (
    <Card className="border hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-tight">
            {formula.nome}
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs shrink-0 capitalize ${AREA_COLOR[formula.area]}`}
          >
            {formula.area}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {/* Expressão */}
        <div className="rounded-lg bg-muted px-4 py-3 text-center">
          <span className="font-mono text-lg font-bold tracking-wide">
            {formula.expressaoPrincipal}
          </span>
        </div>

        {/* Descrição */}
        {formula.descricao && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {formula.descricao}
          </p>
        )}

        {metadados && (
          <div className="flex flex-col gap-2">
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Por que usar
              </span>
              <p className="text-xs leading-relaxed mt-0.5">{metadados.porqueUsar}</p>
            </div>
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                Relação entre grandezas
              </span>
              <p className="text-xs leading-relaxed mt-0.5 text-muted-foreground">
                {metadados.relacaoGrandezas}
              </p>
            </div>
            {fenomenos.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {fenomenos.map((f) => (
                  <Badge key={f.id} variant="secondary" className="text-[10px] font-normal">
                    {f.nome}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <Separator />

        {/* Variáveis envolvidas */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Variáveis envolvidas
          </span>
          <div className="flex flex-wrap gap-1.5">
            {formula.variaveis.map(id => {
              const variavel = catalogoVariaveis.find(v => v.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1"
                >
                  <span className="font-mono text-sm font-bold">
                    {variavel?.simbolo ?? id}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {variavel?.nome ?? id}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CatalogoFormulas() {
  const [areaAtiva, setAreaAtiva] = useState<AreaFisica | "todas">("todas");

  const formulasFiltradas =
    areaAtiva === "todas"
      ? catalogoFormulas
      : catalogoFormulas.filter(f => f.area === areaAtiva);

  const totalPorArea = (area: AreaFisica | "todas") =>
    area === "todas"
      ? catalogoFormulas.length
      : catalogoFormulas.filter(f => f.area === area).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Catálogo de fórmulas</h2>
          <p className="text-sm text-muted-foreground">
            {formulasFiltradas.length} {formulasFiltradas.length === 1 ? "fórmula" : "fórmulas"} cadastradas
          </p>
        </div>
      </div>

      <Tabs
        value={areaAtiva}
        onValueChange={v => setAreaAtiva(v as AreaFisica | "todas")}
      >
        {/* Abas de área */}
        <ScrollArea className="w-full">
          <TabsList className="flex w-max gap-1 bg-muted p-1 rounded-lg">
            {AREAS.map(area => (
              <TabsTrigger
                key={area.valor}
                value={area.valor}
                className="flex items-center gap-1.5 text-xs whitespace-nowrap rounded-md"
              >
                <span>{area.emoji}</span>
                <span>{area.label}</span>
                <Badge
                  variant="secondary"
                  className="ml-1 h-4 px-1 text-[10px] font-bold"
                >
                  {totalPorArea(area.valor)}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* Conteúdo — mesmo grid para todas as abas */}
        {AREAS.map(area => (
          <TabsContent key={area.valor} value={area.valor} className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formulasFiltradas.map(formula => (
                <CardCatalogo key={formula.id} formula={formula} />
              ))}
            </div>

            {formulasFiltradas.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                <span className="text-4xl">📭</span>
                <p className="text-sm text-muted-foreground">
                  Nenhuma fórmula cadastrada nessa área ainda.
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}