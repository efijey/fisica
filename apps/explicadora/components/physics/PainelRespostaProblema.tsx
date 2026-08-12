"use client"

import { useState } from "react"
import { Camera, Mic, Send, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MesaCalculoMental } from "@/components/physics/MesaCalculoMental"
import {
  AREA_COLOR,
  AREA_LABEL,
  catalogoFenomenos,
  catalogoFormulas,
} from "@fisica/physics-core"
import type { ProblemaConceitual } from "@/app/physics/problemas/catalog"
import {
  julgarResposta,
  type ResultadoJuiz,
} from "@/app/physics/problemas/juiz"
import { cn } from "@/lib/utils"

interface PainelRespostaProblemaProps {
  problema: ProblemaConceitual
  onVoltar: () => void
  onJulgado: (vereditoCerto: boolean) => void
  onProximo?: () => void
}

const VEREDITO_STYLE: Record<
  ResultadoJuiz["veredito"],
  { label: string; className: string }
> = {
  certo: {
    label: "Certo",
    className: "bg-green-500/10 text-green-700 border-green-500/30",
  },
  no_caminho: {
    label: "No caminho",
    className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
  },
  desviado: {
    label: "Desviado",
    className: "bg-red-500/10 text-red-700 border-red-500/30",
  },
}

function ModoConceitos({
  problema,
  onJulgado,
  onProximo,
}: {
  problema: ProblemaConceitual
  onJulgado: (vereditoCerto: boolean) => void
  onProximo?: () => void
}) {
  const [texto, setTexto] = useState("")
  const [resultado, setResultado] = useState<ResultadoJuiz | null>(null)
  const [anexoAudio, setAnexoAudio] = useState(false)
  const [anexoFoto, setAnexoFoto] = useState(false)
  const [avisoMock, setAvisoMock] = useState<string | null>(null)

  const formulas = problema.formulas
    .map((id) => catalogoFormulas.find((f) => f.id === id))
    .filter(Boolean)

  function handleMockAudio() {
    setAnexoAudio(true)
    setAvisoMock("Áudio simulado anexado — em breve com gravação real.")
  }

  function handleMockFoto() {
    setAnexoFoto(true)
    setAvisoMock("Foto simulada anexada — em breve com envio real.")
  }

  function handleEnviar() {
    const julgamento = julgarResposta(problema, texto)
    setResultado(julgamento)
    onJulgado(julgamento.veredito === "certo")
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explique sua solução</CardTitle>
          <p className="text-xs text-muted-foreground">
            Não precisa calcular o número — descreva o raciocínio e os conceitos
            que usaria.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resposta-problema">Sua explicação</Label>
            <textarea
              id="resposta-problema"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={6}
              disabled={resultado !== null}
              placeholder="Neste problema eu faria assim: usaria a grandeza… porque…"
              className={cn(
                "w-full min-h-32 rounded-lg border border-input bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-60 resize-y"
              )}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMockAudio}
              disabled={resultado !== null}
            >
              <Mic data-icon="inline-start" />
              {anexoAudio ? "Áudio (simulado)" : "Áudio"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleMockFoto}
              disabled={resultado !== null}
            >
              <Camera data-icon="inline-start" />
              {anexoFoto ? "Foto (simulada)" : "Foto"}
            </Button>
            {(anexoAudio || anexoFoto) && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => {
                  setAnexoAudio(false)
                  setAnexoFoto(false)
                  setAvisoMock(null)
                }}
                disabled={resultado !== null}
              >
                <X data-icon="inline-start" />
                Limpar anexos
              </Button>
            )}
          </div>

          {avisoMock && (
            <p className="text-xs text-muted-foreground">{avisoMock}</p>
          )}

          {resultado === null ? (
            <Button
              type="button"
              onClick={handleEnviar}
              disabled={!texto.trim()}
              className="self-start"
            >
              <Send data-icon="inline-start" />
              Enviar para o juiz
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setResultado(null)}
              >
                Tentar de novo
              </Button>
              {onProximo && (
                <Button type="button" onClick={onProximo}>
                  Próximo problema
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {resultado && (
        <Card className="ring-1 ring-foreground/10">
          <CardHeader className="gap-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">Avaliação</CardTitle>
              <Badge
                variant="outline"
                className={VEREDITO_STYLE[resultado.veredito].className}
              >
                {VEREDITO_STYLE[resultado.veredito].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm leading-relaxed">{resultado.feedback}</p>

            {(resultado.acertos.length > 0 ||
              resultado.faltando.length > 0) && (
              <>
                <Separator />
                <div className="grid gap-3 sm:grid-cols-2">
                  {resultado.acertos.length > 0 && (
                    <div>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        Conceitos encontrados
                      </span>
                      <ul className="mt-1 flex flex-col gap-1">
                        {resultado.acertos.map((c) => (
                          <li key={c} className="text-xs text-green-700">
                            · {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {resultado.faltando.length > 0 && (
                    <div>
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                        Ainda faltando
                      </span>
                      <ul className="mt-1 flex flex-col gap-1">
                        {resultado.faltando.map((c) => (
                          <li key={c} className="text-xs text-muted-foreground">
                            · {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}

            {formulas.length > 0 && (
              <>
                <Separator />
                <div>
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Fórmulas relacionadas
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {formulas.map((f) => (
                      <Badge key={f!.id} variant="outline" className="text-xs">
                        {f!.nome}
                        <span className="ml-1 font-mono text-muted-foreground">
                          {f!.expressaoPrincipal}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function PainelRespostaProblema({
  problema,
  onVoltar,
  onJulgado,
  onProximo,
}: PainelRespostaProblemaProps) {
  const formulas = problema.formulas
    .map((id) => catalogoFormulas.find((f) => f.id === id))
    .filter(Boolean)

  const fenomenos = problema.fenomenos
    .map((id) => catalogoFenomenos.find((f) => f.id === id))
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={onVoltar}>
          ← Voltar aos problemas
        </Button>
        <Badge
          variant="outline"
          className={`text-xs capitalize ${AREA_COLOR[problema.area]}`}
        >
          {AREA_LABEL[problema.area]}
        </Badge>
      </div>

      <Card>
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold leading-tight">
            {problema.titulo}
          </CardTitle>
          {(fenomenos.length > 0 || formulas.length > 0) && (
            <div className="flex flex-wrap gap-1.5">
              {fenomenos.map((f) => (
                <Badge
                  key={f!.id}
                  variant="outline"
                  className="text-[10px] font-normal"
                >
                  {f!.nome}
                </Badge>
              ))}
              {formulas.map((f) => (
                <Badge
                  key={f!.id}
                  variant="outline"
                  className="text-[10px] font-normal font-mono"
                >
                  {f!.nome}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Situação
            </span>
            <p className="text-sm leading-relaxed mt-1">{problema.contexto}</p>
          </div>
          <div className="rounded-lg bg-muted px-4 py-3">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
              Sua tarefa
            </span>
            <p className="text-sm font-medium leading-relaxed mt-1">
              {problema.pergunta}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="conceitos">
        <TabsList>
          <TabsTrigger value="conceitos">Explicar conceitos</TabsTrigger>
          <TabsTrigger value="voz">Resolver em voz</TabsTrigger>
        </TabsList>

        <TabsContent value="conceitos" className="mt-4">
          <ModoConceitos
            problema={problema}
            onJulgado={onJulgado}
            onProximo={onProximo}
          />
        </TabsContent>

        <TabsContent value="voz" className="mt-4">
          <MesaCalculoMental problema={problema} onJulgado={onJulgado} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
