"use client"

import { useEffect, useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  XAxis,
  YAxis,
} from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  AREA_COLOR,
  AREA_LABEL,
  catalogoGraficos,
  dominioYSugerido,
  gerarPontosCurva,
  GRAU_LABEL,
  parametrosPadrao,
  type AreaFisica,
  type GrauEquacao,
  type VisualizacaoGrafico,
} from "@fisica/physics-core"

const chartConfig = {
  y: {
    label: "y",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type FiltroGrau = GrauEquacao | "todos"
type FiltroArea = AreaFisica | "todas"

const FILTROS_GRAU: { valor: FiltroGrau; label: string }[] = [
  { valor: "todos", label: "Todos" },
  { valor: 1, label: "1º grau" },
  { valor: 2, label: "2º grau" },
]

const AREAS_GRAFICO: FiltroArea[] = [
  "todas",
  "cinematica",
  "dinamica",
  "energia",
]

function formatNumero(n: number): string {
  if (Number.isInteger(n)) return String(n)
  const abs = Math.abs(n)
  if (abs >= 10) return n.toFixed(1)
  if (abs >= 1) return n.toFixed(2)
  return n.toFixed(3)
}

function ListaRelacoes({
  itens,
  selecionadoId,
  onSelect,
}: {
  itens: VisualizacaoGrafico[]
  selecionadoId: string
  onSelect: (id: string) => void
}) {
  return (
    <ScrollArea className="h-[min(70vh,560px)] pr-2">
      <div className="flex flex-col gap-2">
        {itens.map((item) => {
          const ativo = item.id === selecionadoId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`text-left rounded-lg border px-3 py-2.5 transition-colors ${
                ativo
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-muted/60"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-snug">{item.nome}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    {item.eixosLabel}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <Badge variant="outline" className="text-[10px]">
                    {GRAU_LABEL[item.grau]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${AREA_COLOR[item.area]}`}
                  >
                    {AREA_LABEL[item.area]}
                  </Badge>
                </div>
              </div>
            </button>
          )
        })}
        {itens.length === 0 && (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Nenhuma relação com esses filtros.
          </p>
        )}
      </div>
    </ScrollArea>
  )
}

type ModoEscala = "fixa" | "automatica"

interface EscalaEixos {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

function escalaInicial(visualizacao: VisualizacaoGrafico): EscalaEixos {
  const params = parametrosPadrao(visualizacao)
  const intervaloX = {
    min: visualizacao.eixoX.min,
    max: visualizacao.eixoX.max,
  }
  const pontos = gerarPontosCurva(visualizacao, params, intervaloX)
  const y = dominioYSugerido(pontos)
  return {
    xMin: intervaloX.min,
    xMax: intervaloX.max,
    yMin: y.min,
    yMax: y.max,
  }
}

function CampoEscala({
  id,
  label,
  value,
  disabled,
  onChange,
}: {
  id: string
  label: string
  value: number
  disabled?: boolean
  onChange: (n: number) => void
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <Label htmlFor={id} className="text-[11px] text-muted-foreground">
        {label}
      </Label>
      <input
        id={id}
        type="number"
        value={Number.isFinite(value) ? value : 0}
        disabled={disabled}
        onChange={(e) => {
          const n = e.target.valueAsNumber
          if (!Number.isNaN(n)) onChange(n)
        }}
        className="h-8 w-full rounded-md border border-input bg-background px-2 font-mono text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}

function CanvasGrafico({ visualizacao }: { visualizacao: VisualizacaoGrafico }) {
  const [params, setParams] = useState(() => parametrosPadrao(visualizacao))
  const [modoEscala, setModoEscala] = useState<ModoEscala>("fixa")
  const [escala, setEscala] = useState(() => escalaInicial(visualizacao))

  const intervaloX = useMemo(
    () => ({ min: escala.xMin, max: escala.xMax }),
    [escala.xMin, escala.xMax]
  )

  const pontos = useMemo(
    () => gerarPontosCurva(visualizacao, params, intervaloX),
    [visualizacao, params, intervaloX]
  )

  const destaqueY = visualizacao.avaliar(visualizacao.pontoDestaqueX, params)
  const destaqueVisivel =
    visualizacao.pontoDestaqueX >= escala.xMin &&
    visualizacao.pontoDestaqueX <= escala.xMax
  const { eixoX, eixoY } = visualizacao

  const data = pontos.map((p) => ({
    x: Number(p.x.toFixed(4)),
    y: Number(p.y.toFixed(4)),
  }))

  const yDomain =
    modoEscala === "fixa"
      ? ([escala.yMin, escala.yMax] as [number, number])
      : (["auto", "auto"] as const)

  function setParam(id: string, value: number) {
    setParams((prev) => ({ ...prev, [id]: value }))
  }

  function patchEscala(patch: Partial<EscalaEixos>) {
    setEscala((prev) => ({ ...prev, ...patch }))
  }

  function ajustarEscalaACurva() {
    const y = dominioYSugerido(pontos)
    setEscala((prev) => ({
      ...prev,
      yMin: y.min,
      yMax: y.max,
    }))
    setModoEscala("fixa")
  }

  function restaurarEscalaPadrao() {
    setEscala(escalaInicial(visualizacao))
    setModoEscala("fixa")
  }

  const escalaXInvalida = escala.xMin >= escala.xMax
  const escalaYInvalida = escala.yMin >= escala.yMax

  return (
    <div className="flex flex-col gap-5 min-w-0">
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold leading-tight">
            {visualizacao.nome}
          </h3>
          <Badge variant="outline" className="text-xs">
            {GRAU_LABEL[visualizacao.grau]}
          </Badge>
          <Badge
            variant="outline"
            className={`text-xs ${AREA_COLOR[visualizacao.area]}`}
          >
            {AREA_LABEL[visualizacao.area]}
          </Badge>
        </div>
        <div className="rounded-lg bg-muted px-4 py-3 text-center mt-1">
          <span className="font-mono text-lg font-bold tracking-wide">
            {visualizacao.expressao}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Eixos: {eixoX.simbolo} ({eixoX.unidade}) × {eixoY.simbolo} (
          {eixoY.unidade})
        </p>
      </div>

      <div className="rounded-lg border bg-muted/30 px-3 py-3 flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Escala do gráfico
            </span>
            <p className="text-xs text-muted-foreground mt-0.5">
              Com escala fixa, ao mudar parâmetros a janela permanece — a curva
              se move e fica mais fácil perceber a mudança.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            {(
              [
                { valor: "fixa" as const, label: "Fixa" },
                { valor: "automatica" as const, label: "Automática" },
              ] as const
            ).map((opcao) => (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => setModoEscala(opcao.valor)}
                className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                  modoEscala === opcao.valor
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {opcao.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <CampoEscala
            id="escala-x-min"
            label={`${eixoX.simbolo} mín (${eixoX.unidade})`}
            value={escala.xMin}
            onChange={(n) => patchEscala({ xMin: n })}
          />
          <CampoEscala
            id="escala-x-max"
            label={`${eixoX.simbolo} máx (${eixoX.unidade})`}
            value={escala.xMax}
            onChange={(n) => patchEscala({ xMax: n })}
          />
          <CampoEscala
            id="escala-y-min"
            label={`${eixoY.simbolo} mín (${eixoY.unidade})`}
            value={escala.yMin}
            disabled={modoEscala === "automatica"}
            onChange={(n) => patchEscala({ yMin: n })}
          />
          <CampoEscala
            id="escala-y-max"
            label={`${eixoY.simbolo} máx (${eixoY.unidade})`}
            value={escala.yMax}
            disabled={modoEscala === "automatica"}
            onChange={(n) => patchEscala({ yMax: n })}
          />
        </div>

        {(escalaXInvalida || (modoEscala === "fixa" && escalaYInvalida)) && (
          <p className="text-xs text-destructive">
            O valor mínimo de cada eixo precisa ser menor que o máximo.
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={ajustarEscalaACurva}
          >
            Ajustar à curva atual
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={restaurarEscalaPadrao}
          >
            Restaurar padrão
          </Button>
        </div>
      </div>

      <ChartContainer
        config={chartConfig}
        className="aspect-[16/10] w-full min-h-[280px]"
        initialDimension={{ width: 640, height: 400 }}
      >
        <LineChart
          data={escalaXInvalida ? [] : data}
          margin={{ top: 12, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            domain={
              escalaXInvalida
                ? ["auto", "auto"]
                : [escala.xMin, escala.xMax]
            }
            allowDataOverflow
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(v) => formatNumero(Number(v))}
            label={{
              value: `${eixoX.simbolo} (${eixoX.unidade})`,
              position: "insideBottom",
              offset: -2,
              style: { fill: "var(--muted-foreground)", fontSize: 11 },
            }}
          />
          <YAxis
            type="number"
            domain={
              modoEscala === "fixa" && !escalaYInvalida
                ? yDomain
                : ["auto", "auto"]
            }
            allowDataOverflow={modoEscala === "fixa"}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={48}
            tickFormatter={(v) => formatNumero(Number(v))}
            label={{
              value: `${eixoY.simbolo} (${eixoY.unidade})`,
              angle: -90,
              position: "insideLeft",
              style: { fill: "var(--muted-foreground)", fontSize: 11 },
            }}
          />
          <ChartTooltip
            cursor={{ strokeDasharray: "4 4" }}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const x = payload?.[0]?.payload?.x
                  if (x == null) return ""
                  return `${eixoX.simbolo} = ${formatNumero(Number(x))} ${eixoX.unidade}`
                }}
                formatter={(value) => (
                  <span className="font-mono">
                    {eixoY.simbolo} = {formatNumero(Number(value))}{" "}
                    {eixoY.unidade}
                  </span>
                )}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="y"
            stroke="var(--color-y)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
          {destaqueVisivel && !escalaXInvalida && (
            <ReferenceDot
              x={visualizacao.pontoDestaqueX}
              y={destaqueY}
              r={5}
              fill="var(--color-y)"
              stroke="var(--background)"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground -mt-2">
        Ponto destacado: ({eixoX.simbolo} ={" "}
        {formatNumero(visualizacao.pontoDestaqueX)} {eixoX.unidade},{" "}
        {eixoY.simbolo} = {formatNumero(destaqueY)} {eixoY.unidade})
      </p>

      <div className="flex flex-col gap-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Parâmetros
        </span>
        {visualizacao.parametros.map((param) => (
          <div key={param.id} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor={`param-${param.id}`} className="text-sm">
                <span className="font-mono font-semibold">{param.simbolo}</span>
                <span className="text-muted-foreground font-normal">
                  {" "}
                  — {param.nome}
                </span>
              </Label>
              <span className="font-mono text-sm tabular-nums">
                {formatNumero(params[param.id] ?? param.default)} {param.unidade}
              </span>
            </div>
            <Slider
              id={`param-${param.id}`}
              min={param.min}
              max={param.max}
              step={param.step}
              value={[params[param.id] ?? param.default]}
              onValueChange={(v) => {
                const next = Array.isArray(v) ? v[0] : v
                if (typeof next === "number") setParam(param.id, next)
              }}
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          O que a forma revela
        </span>
        <p className="text-sm leading-relaxed">{visualizacao.insight}</p>
      </div>
    </div>
  )
}

export function GraficosEquacoes() {
  const [grau, setGrau] = useState<FiltroGrau>("todos")
  const [area, setArea] = useState<FiltroArea>("todas")
  const [selecionadoId, setSelecionadoId] = useState(catalogoGraficos[0].id)

  const filtrados = useMemo(() => {
    return catalogoGraficos.filter((g) => {
      if (grau !== "todos" && g.grau !== grau) return false
      if (area !== "todas" && g.area !== area) return false
      return true
    })
  }, [grau, area])

  const selecionado =
    filtrados.find((g) => g.id === selecionadoId) ??
    filtrados[0] ??
    catalogoGraficos[0]

  useEffect(() => {
    if (selecionado && selecionado.id !== selecionadoId) {
      setSelecionadoId(selecionado.id)
    }
  }, [selecionado, selecionadoId])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Gráficos das equações</h2>
        <p className="text-sm text-muted-foreground">
          Veja a forma das relações na natureza — retas (1º grau) e parábolas
          (2º grau). Ajuste os parâmetros e observe a curva.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        <aside className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Grau
            </span>
            <div className="flex flex-wrap gap-1.5">
              {FILTROS_GRAU.map((f) => (
                <button
                  key={String(f.valor)}
                  type="button"
                  onClick={() => setGrau(f.valor)}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    grau === f.valor
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Área
            </span>
            <div className="flex flex-wrap gap-1.5">
              {AREAS_GRAFICO.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setArea(a)}
                  className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                    area === a
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-muted/60"
                  }`}
                >
                  {a === "todas" ? "Todas" : AREA_LABEL[a]}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          <ListaRelacoes
            itens={filtrados}
            selecionadoId={selecionado.id}
            onSelect={setSelecionadoId}
          />
        </aside>

        <Card className="border shadow-none">
          <CardContent className="pt-6 px-4 sm:px-6 pb-6">
            <CanvasGrafico key={selecionado.id} visualizacao={selecionado} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
