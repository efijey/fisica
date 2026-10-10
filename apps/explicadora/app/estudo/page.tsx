import type { Metadata } from "next"

import { Equacao, TextoComEquacoes } from "@/components/physics/Equacao"

export const metadata: Metadata = {
  title: "Trilha de Física 1 — Física",
}

const PREVIA = [
  {
    titulo: "Velocidade instantânea é um limite",
    texto:
      "A velocidade média olha um intervalo inteiro. Encolhendo o intervalo até quase nada, sobra a velocidade naquele instante: \\[ v = \\lim_{\\Delta t \\to 0} \\frac{\\Delta x}{\\Delta t} = \\frac{dx}{dt} \\] No gráfico \\(x(t)\\), é a inclinação da reta tangente.",
  },
  {
    titulo: "Aceleração é a derivada da velocidade",
    texto:
      "Do mesmo jeito, a aceleração mede quão rápido a velocidade muda: \\[ a = \\frac{dv}{dt} = \\frac{d^2x}{dt^2} \\]",
  },
  {
    titulo: "Deslocamento é uma integral",
    texto:
      "O caminho inverso: somando pedacinhos \\(v\\,dt\\), recupera-se o deslocamento. É a área sob a curva \\(v(t)\\): \\[ \\Delta x = \\int_{t_1}^{t_2} v(t)\\,dt \\]",
  },
]

export default function PaginaEstudo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Trilha de Física 1
          </h1>
          <p className="text-sm text-muted-foreground">
            Prévia de como as equações aparecem na trilha (capítulo 2:
            movimento retilíneo).
          </p>
        </div>

        {PREVIA.map((secao) => (
          <section key={secao.titulo} className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold">{secao.titulo}</h2>
            <TextoComEquacoes texto={secao.texto} className="leading-7" />
          </section>
        ))}

        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Aceleração constante</h2>
          <p className="leading-7">
            Integrando <Equacao tex="a" /> constante duas vezes, saem as
            equações do
            movimento uniformemente variado:
          </p>
          <Equacao bloco tex="v(t) = v_0 + a\,t" />
          <Equacao bloco tex="x(t) = x_0 + v_0\,t + \tfrac{1}{2}\,a\,t^2" />
        </section>
      </div>
    </div>
  )
}
