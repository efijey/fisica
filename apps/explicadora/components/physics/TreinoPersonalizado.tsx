"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ModoConceitos } from "@/components/physics/PainelRespostaProblema"
import { cardsLiteratura } from "@/app/physics/personalizado/literatura/cards"
import { mundosInteresse } from "@/app/physics/personalizado/mundos/catalog"
import {
  limparProblemas,
  lerPrefs,
  lerProblemasSalvos,
  removerProblema,
  salvarPrefs,
  salvarProblema,
} from "@/app/physics/personalizado/storage"
import type { ProblemaPersonalizado } from "@/app/physics/personalizado/tipos"

/** Lê localStorage na inicialização: carregar só no cliente (`ssr: false`). */
export default function TreinoPersonalizado() {
  const [mundoId, setMundoId] = useState(() => lerPrefs().mundoId)
  const [cardId, setCardId] = useState(() => lerPrefs().cardId)
  const [salvos, setSalvos] = useState<ProblemaPersonalizado[]>(lerProblemasSalvos)
  const [ativo, setAtivo] = useState<ProblemaPersonalizado | null>(null)
  const [status, setStatus] = useState<string>("")
  const [gerando, setGerando] = useState(false)
  const [julgado, setJulgado] = useState(false)

  const card = cardsLiteratura.find((c) => c.id === cardId)
  const mundo = mundosInteresse.find((m) => m.id === mundoId)

  async function handleGerar() {
    setGerando(true)
    setStatus("Gerando…")
    setAtivo(null)
    try {
      salvarPrefs({ mundoId, cardId })
      const res = await fetch("/api/personalizado/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mundoId, cardId }),
      })
      const data = (await res.json()) as {
        problema?: ProblemaPersonalizado
        modelo?: string
        llmAtivo?: boolean
        error?: string
      }
      if (!res.ok || !data.problema) {
        setStatus(data.error ?? "Falha ao gerar")
        return
      }
      const next = salvarProblema(data.problema)
      setSalvos(next)
      setAtivo(data.problema)
      setJulgado(false)
      const modo = data.llmAtivo ? `LLM (${data.modelo})` : `mock (${data.modelo})`
      setStatus(`Pronto — ${modo}. Salvo só neste navegador.`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Erro de rede")
    } finally {
      setGerando(false)
    }
  }

  if (ativo) {
    return (
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setAtivo(null)}>
            ← Voltar
          </Button>
          <Badge variant="outline">{mundo?.nome ?? ativo.mundoId}</Badge>
          <Badge variant="outline">{card?.conceito ?? ativo.cardId}</Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{ativo.titulo}</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {ativo.contexto}
          </p>
          <p className="text-sm font-medium mt-2">{ativo.pergunta}</p>
        </div>

        <div className="rounded-lg border border-dashed px-4 py-3 text-sm space-y-1 bg-muted/30">
          <p className="font-medium text-foreground">Fonte científica</p>
          <p className="text-muted-foreground">
            {ativo.citacao.obra} — {ativo.citacao.autores}
            {ativo.citacao.secao ? ` · ${ativo.citacao.secao}` : ""}
            {ativo.citacao.licenca ? ` · ${ativo.citacao.licenca}` : ""}
          </p>
          {ativo.citacao.url ? (
            <a
              href={ativo.citacao.url}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-2 text-xs"
            >
              Abrir referência
            </a>
          ) : null}
          {julgado ? (
            <p className="text-muted-foreground pt-2">{ativo.explicacao}</p>
          ) : (
            <p className="text-xs text-muted-foreground pt-2">
              A explicação do conceito aparece depois que você enviar sua
              resposta.
            </p>
          )}
        </div>

        <ModoConceitos
          key={ativo.id}
          problema={{
            rubrica: ativo.rubrica,
            dica: ativo.dica,
            formulas: ativo.formulaIds,
          }}
          onJulgado={() => setJulgado(true)}
        />

        {status ? (
          <p className="text-xs text-muted-foreground">{status}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Treino personalizado
        </h2>
        <p className="text-sm text-muted-foreground">
          Paciente zero: escolhe um mundo (TFT / LoL) e um conceito ancorado em
          literatura. A pele do jogo é criativa; a física vem do trecho citado.
          Resultado fica neste navegador (localStorage) — sem login ainda.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="mundo">Mundo</Label>
          <select
            id="mundo"
            value={mundoId}
            onChange={(e) => setMundoId(e.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {mundosInteresse.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
          {mundo ? (
            <p className="text-xs text-muted-foreground">{mundo.descricao}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="card">Conceito (com fonte)</Label>
          <select
            id="card"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            className="h-9 rounded-md border bg-background px-3 text-sm"
          >
            {cardsLiteratura.map((c) => (
              <option key={c.id} value={c.id}>
                {c.conceito}
              </option>
            ))}
          </select>
          {card ? (
            <p className="text-xs text-muted-foreground">
              Fonte: {card.citacao.obra} ({card.citacao.autores})
              {card.citacao.secao ? ` — ${card.citacao.secao}` : ""}
            </p>
          ) : null}
        </div>
      </div>

      {card ? (
        <div className="rounded-lg border px-4 py-3 text-sm space-y-2">
          <p className="font-medium">Trecho canônico (âncora)</p>
          <p className="text-muted-foreground whitespace-pre-wrap text-xs leading-relaxed">
            {card.trecho}
          </p>
          <p className="text-xs text-muted-foreground">
            Objetivo: {card.objetivoAprendizagem}
          </p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleGerar} disabled={gerando}>
          {gerando ? "Gerando…" : "Gerar exercício para mim"}
        </Button>
        {status ? (
          <span className="text-xs text-muted-foreground">{status}</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-medium">Gerados neste navegador</h3>
          {salvos.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                limparProblemas()
                setSalvos([])
              }}
            >
              Limpar
            </Button>
          ) : null}
        </div>
        {salvos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda não há exercícios salvos. Gere o primeiro.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {salvos.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2"
              >
                <button
                  type="button"
                  className="text-left text-sm font-medium hover:underline"
                  onClick={() => {
                    setAtivo(p)
                    setJulgado(false)
                  }}
                >
                  {p.titulo}
                </button>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-normal">
                    {p.mundoId}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSalvos(removerProblema(p.id))}
                  >
                    Apagar
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
