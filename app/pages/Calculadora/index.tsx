"use client"

import { useState, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SeletorVariaveis } from "@/components/physics/SeletorVariavel";
import { ListaFormulas } from "@/components/physics/ListaFormulas";
import { CatalogoFormulas } from "@/components/physics/CatalogoFormulas";
import { ExploradorVariavel } from "@/components/physics/ExploradorVariavel";
import { inferirFormulas } from "@/app/physics/engine/inferencia";

export default function Calculadora() {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);

  function handleToggle(id: string) {
    setSelecionadas(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    );
  }

  function handleLimpar() {
    setSelecionadas([]);
  }

  const resultados = useMemo(
    () => inferirFormulas(selecionadas),
    [selecionadas]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-6">

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Física — Explicadora de Fenômenos
          </h1>
          <p className="text-sm text-muted-foreground">
            Entenda por que cada fórmula se aplica, como as grandezas se relacionam
            e em quais fenômenos da natureza elas aparecem.
          </p>
        </div>

        <Separator />

        <Tabs defaultValue="inferencia">
          <TabsList className="w-full sm:w-auto flex-wrap h-auto">
            <TabsTrigger value="inferencia" className="flex-1 sm:flex-none">
              Inferência
            </TabsTrigger>
            <TabsTrigger value="explorar" className="flex-1 sm:flex-none">
              Explorar grandezas
            </TabsTrigger>
            <TabsTrigger value="catalogo" className="flex-1 sm:flex-none">
              Catálogo de fórmulas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inferencia" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <SeletorVariaveis
                selecionadas={selecionadas}
                onToggle={handleToggle}
                onLimpar={handleLimpar}
              />
              <div className="hidden lg:flex justify-center">
                <Separator orientation="vertical" />
              </div>
              <ListaFormulas
                resultados={resultados}
                variaveisSelecionadas={selecionadas}
              />
            </div>
          </TabsContent>

          <TabsContent value="explorar" className="mt-6">
            <ExploradorVariavel />
          </TabsContent>

          <TabsContent value="catalogo" className="mt-6">
            <CatalogoFormulas />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
