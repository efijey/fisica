"use client"

import { useState, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SeletorVariaveis } from "@/components/physics/SeletorVariavel";
import { ListaFormulas } from "@/components/physics/ListaFormulas";
import { CatalogoFormulas } from "@/components/physics/CatalogoFormulas";
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

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Física — Motor de Fórmulas
          </h1>
          <p className="text-sm text-muted-foreground">
            Selecione as variáveis que você tem ou consulte o catálogo completo.
          </p>
        </div>

        <Separator />

        {/* Abas principais */}
        <Tabs defaultValue="calculadora">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="calculadora" className="flex-1 sm:flex-none">
              Calculadora
            </TabsTrigger>
            <TabsTrigger value="catalogo" className="flex-1 sm:flex-none">
              Catálogo de fórmulas
            </TabsTrigger>
          </TabsList>

          {/* Aba calculadora */}
          <TabsContent value="calculadora" className="mt-6">
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

          {/* Aba catálogo */}
          <TabsContent value="catalogo" className="mt-6">
            <CatalogoFormulas />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}