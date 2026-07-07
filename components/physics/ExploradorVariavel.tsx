"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AREA_COLOR, AREA_LABEL } from "@/lib/physics/areas";
import {
  listarVariaveisMaisConectadas,
  obterConexaoVariavel,
} from "@/app/physics/engine/conexoes";
import { obterMetadadosVariavel } from "@/app/physics/variables/metadata";
import { obterMetadadosFormula } from "@/app/physics/formulas/metadata";

export function ExploradorVariavel() {
  const variaveisConectadas = useMemo(() => listarVariaveisMaisConectadas(), []);
  const [selecionadaId, setSelecionadaId] = useState(
    variaveisConectadas[0]?.variavel.id ?? ""
  );

  const conexao = useMemo(
    () => (selecionadaId ? obterConexaoVariavel(selecionadaId) : undefined),
    [selecionadaId]
  );

  const metadados = conexao
    ? obterMetadadosVariavel(conexao.variavel.id)
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      {/* Lista de grandezas */}
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-lg font-semibold">Explorar grandezas</h2>
          <p className="text-sm text-muted-foreground">
            Escolha uma variável para ver em quantas equações ela aparece e por quê.
          </p>
        </div>

        <ScrollArea className="h-[520px] pr-3">
          <div className="flex flex-col gap-1.5">
            {variaveisConectadas.map((item) => {
              const ativa = item.variavel.id === selecionadaId;
              return (
                <button
                  key={item.variavel.id}
                  onClick={() => setSelecionadaId(item.variavel.id)}
                  className={cn(
                    "w-full text-left rounded-lg border px-3 py-2.5 transition-all",
                    "hover:border-primary/50 hover:shadow-sm",
                    ativa
                      ? "border-primary bg-primary/10 shadow-sm"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-base font-bold text-primary shrink-0">
                        {item.variavel.simbolo}
                      </span>
                      <span className="text-sm truncate">{item.variavel.nome}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">
                      {item.totalFormulas}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Detalhe da grandeza */}
      {conexao ? (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3 flex-wrap">
              <span className="font-mono text-3xl font-bold text-primary">
                {conexao.variavel.simbolo}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">{conexao.variavel.nome}</h3>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="outline">{conexao.variavel.unidade}</Badge>
                  <Badge variant="outline" className="capitalize">
                    {conexao.variavel.categoria}
                  </Badge>
                </div>
              </div>
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4 pb-4">
                <p className="text-sm leading-relaxed">
                  <span className="font-semibold">{conexao.variavel.simbolo}</span> aparece
                  em{" "}
                  <span className="font-semibold text-primary">
                    {conexao.totalFormulas}{" "}
                    {conexao.totalFormulas === 1 ? "equação" : "equações"}
                  </span>{" "}
                  {conexao.areas.length > 0 && (
                    <>
                      nas áreas de{" "}
                      {conexao.areas.map((a) => AREA_LABEL[a]).join(", ")}
                    </>
                  )}
                  .
                </p>
              </CardContent>
            </Card>
          </div>

          {metadados && (
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-sm font-semibold mb-1">O que significa</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {metadados.significado}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1">Quando é relevante</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {metadados.quandoRelevante}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Exemplos na natureza</h4>
                <div className="flex flex-wrap gap-1.5">
                  {metadados.exemplosNatureza.map((exemplo) => (
                    <Badge key={exemplo} variant="secondary" className="text-xs font-normal">
                      {exemplo}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {conexao.fenomenos.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-semibold">Fenômenos associados</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {conexao.fenomenos.map((fenomeno) => (
                    <Card key={fenomeno.id} className="border">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-semibold">
                          {fenomeno.nome}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          {fenomeno.descricao}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {fenomeno.entidades.map((e) => (
                            <Badge key={e} variant="outline" className="text-[10px]">
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold">
              Equações em que {conexao.variavel.simbolo} aparece
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {conexao.formulas.map(({ formula, area }) => {
                const meta = obterMetadadosFormula(formula.id);
                return (
                  <Card key={formula.id} className="border">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-semibold leading-tight">
                          {formula.nome}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${AREA_COLOR[area]}`}
                        >
                          {AREA_LABEL[area]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 flex flex-col gap-2">
                      <div className="rounded-md bg-muted px-3 py-2 text-center">
                        <span className="font-mono text-sm font-bold">
                          {formula.expressaoPrincipal}
                        </span>
                      </div>
                      {meta && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {meta.porqueUsar}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
          Selecione uma grandeza para explorar suas conexões.
        </div>
      )}
    </div>
  );
}
