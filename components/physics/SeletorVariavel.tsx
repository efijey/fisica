"use client";
// src/components/physics/SeletorVariaveis.tsx

import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardVariavel } from "./CardVariavel";
import {
  catalogoVariaveis,
  type CategoriaFisica
} from "@/app/physics/variables/catalog";

const CATEGORIAS: { valor: CategoriaFisica | "todas"; label: string }[] = [
  { valor: "todas",      label: "Todas"      },
  { valor: "cinematica", label: "Cinemática" },
  { valor: "dinamica",   label: "Dinâmica"   },
  { valor: "energia",    label: "Energia"    },
  { valor: "momento",    label: "Momento"    },
  { valor: "rotacao",    label: "Rotação"    },
  { valor: "gravitacao", label: "Gravitação" },
];

interface SeletorVariaveisProps {
  selecionadas: string[];
  onToggle: (id: string) => void;
  onLimpar: () => void;
}

export function SeletorVariaveis({
  selecionadas,
  onToggle,
  onLimpar,
}: SeletorVariaveisProps) {
  const porCategoria = useMemo(() => {
    return (categoria: CategoriaFisica | "todas") =>
      categoria === "todas"
        ? catalogoVariaveis
        : catalogoVariaveis.filter(v => v.categoria === categoria);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Variáveis disponíveis</h2>
          <p className="text-sm text-muted-foreground">
            Selecione as variáveis que você conhece no problema
          </p>
        </div>

        {selecionadas.length > 0 && (
          <button
            onClick={onLimpar}
            className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Limpar ({selecionadas.length})
          </button>
        )}
      </div>

      <Tabs defaultValue="todas">
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted p-1 rounded-lg">
          {CATEGORIAS.map(cat => (
            <TabsTrigger
              key={cat.valor}
              value={cat.valor}
              className="text-xs capitalize rounded-md"
            >
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {CATEGORIAS.map(cat => (
          <TabsContent key={cat.valor} value={cat.valor} className="mt-3">
            <ScrollArea className="h-[420px] pr-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {porCategoria(cat.valor).map(variavel => (
                  <CardVariavel
                    key={variavel.id}
                    variavel={variavel}
                    selecionada={selecionadas.includes(variavel.id)}
                    onToggle={onToggle}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}