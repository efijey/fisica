"use client"

import { useId, useState } from "react"
import { Lightbulb, Send } from "lucide-react"

import type { RubricaProblema } from "@/app/physics/problemas/catalog"
import { julgarResposta, type ResultadoJuiz } from "@/app/physics/problemas/juiz"
import { TextoComEquacoes } from "@/components/physics/Equacao"
import { VEREDITO_STYLE } from "@/components/physics/PainelRespostaProblema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ExercicioTrilha = {
  pergunta: string
  /** O que uma boa resposta precisa ter. Orienta sem revelar a resposta. */
  criterios: string[]
  dica: string
  rubrica: RubricaProblema
  /** Mostrada só depois da primeira resposta enviada. */
  explicacao: string
}

export function ExercicioConceitual({ exercicio }: { exercicio: ExercicioTrilha }) {
  const id = useId()
  const [texto, setTexto] = useState("")
  const [resultado, setResultado] = useState<ResultadoJuiz | null>(null)
  const [julgado, setJulgado] = useState(false)
  const [verDica, setVerDica] = useState(false)

  function enviar() {
    setResultado(julgarResposta(exercicio, texto))
    setJulgado(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <TextoComEquacoes texto={exercicio.pergunta} className="leading-7 font-medium" />

      <div className="rounded-lg bg-muted/50 p-3 text-sm">
        <p className="font-medium">Uma boa resposta:</p>
        <ul className="list-disc pl-5">
          {exercicio.criterios.map((c, i) => (
            <li key={i}>
              <TextoComEquacoes texto={c} />
            </li>
          ))}
        </ul>
        <p className="mt-1 text-muted-foreground">
          Duas a quatro frases bastam.
        </p>
        {verDica ? (
          <p className="mt-2">
            <span className="font-medium">Dica:</span> {exercicio.dica}
          </p>
        ) : (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setVerDica(true)}
            className="mt-1 -ml-2"
          >
            <Lightbulb data-icon="inline-start" />
            Ver dica
          </Button>
        )}
      </div>

      <label htmlFor={id} className="sr-only">
        Sua explicação
      </label>
      <textarea
        id={id}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        rows={4}
        disabled={resultado !== null}
        placeholder="Explique com suas palavras: o que acontece e por quê…"
        className={cn(
          "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm",
          "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-60 resize-y"
        )}
      />

      {resultado === null ? (
        <Button
          type="button"
          size="sm"
          onClick={enviar}
          disabled={!texto.trim()}
          className="self-start"
        >
          <Send data-icon="inline-start" />
          Enviar para o juiz
        </Button>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={VEREDITO_STYLE[resultado.veredito].className}
            >
              {VEREDITO_STYLE[resultado.veredito].label}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setResultado(null)}
            >
              Tentar de novo
            </Button>
          </div>
          <p className="text-sm leading-relaxed">{resultado.feedback}</p>
        </div>
      )}

      {julgado && (
        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Explicação
          </p>
          <TextoComEquacoes texto={exercicio.explicacao} className="leading-7" />
        </div>
      )}
    </div>
  )
}
