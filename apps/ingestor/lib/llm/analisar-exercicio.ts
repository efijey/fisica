import {
  catalogoFenomenos,
  catalogoFormulas,
  catalogoGraficos,
  catalogoVariaveis,
  AREA_LABEL,
} from "@fisica/physics-core";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import { analisarExercicio, type ResultadoAnalise } from "@/lib/parser/analisar";
import type { AnaliseCompleta, PropostaCatalogo } from "@/lib/types";

const valorSchema = z.object({
  variableId: z.string(),
  value: z.number(),
  unit: z.string(),
  role: z.enum(["dado", "incognita"]),
});

const rubricaSchema = z.object({
  conceitosObrigatorios: z.array(z.string()),
  conceitosAlternativos: z.array(z.string()),
  conceitosProibidos: z.array(z.string()),
  minObrigatorios: z.number(),
});

const propostaSchema = z.object({
  kind: z.enum(["area", "formula", "variable", "phenomenon", "graph"]),
  proposedId: z.string(),
  confidence: z.number(),
  /** JSON stringificado do payload (OpenAI structured outputs não aceita z.record). */
  payloadJson: z.string(),
});

const analiseSchema = z.object({
  variaveis: z.array(z.string()),
  formulas: z.array(z.string()),
  fenomenos: z.array(z.string()),
  graphs: z.array(z.string()),
  entidades: z.array(z.string()),
  valores: z.array(valorSchema),
  area: z.string().nullable(),
  confidence: z.number(),
  titulo: z.string(),
  contexto: z.string(),
  pergunta: z.string(),
  dica: z.string(),
  rubrica: rubricaSchema,
  passosPreResolucao: z.array(z.string()),
  computedAnswer: z.number().nullable(),
  computedUnit: z.string().nullable(),
  propostas: z.array(propostaSchema),
});

function snapshotCatalogo(): string {
  const formulas = catalogoFormulas.map((f) => `${f.id} (${f.area}): ${f.expressaoPrincipal}`);
  const variaveis = catalogoVariaveis.map(
    (v) => `${v.id} [${v.categoria}] ${v.simbolo} (${v.unidade})`
  );
  const fenomenos = catalogoFenomenos.map((f) => `${f.id} (${f.area}): ${f.nome}`);
  const graficos = catalogoGraficos.map(
    (g) => `${g.id} → formula ${g.formulaId} (${g.area}): ${g.eixosLabel}`
  );
  const areas = Object.keys(AREA_LABEL).join(", ");

  return `ÁREAS: ${areas}

FÓRMULAS:
${formulas.join("\n")}

VARIÁVEIS:
${variaveis.join("\n")}

FENÔMENOS:
${fenomenos.join("\n")}

GRÁFICOS:
${graficos.join("\n")}`;
}

function systemPrompt(): string {
  return `Você analisa enunciados de física (ensino médio/vestibular) para alimentar um catálogo educacional.

Tarefas:
1. Mapear o enunciado aos IDs EXISTENTES do catálogo (fórmulas, variáveis, fenômenos, gráficos).
2. Extrair valores numéricos (dados/incógnita) quando houver.
3. Produzir campos de problema conceitual: titulo, contexto, pergunta, dica, rubrica (sinônimos separados por |).
4. Pré-resolver em passos curtos (passosPreResolucao) e, se possível, computedAnswer + computedUnit (só validação interna).
5. Se faltar área/fórmula/variável/fenômeno/gráfico no catálogo, proponha em "propostas" com payloadJson (string JSON) no shape do core:
   - area: {"id","label","color?","emoji?"}
   - formula: {"id","nome","expressaoPrincipal","area","variaveis":[],"descricao?","variacoes":[{"isola","expressao"}]}
   - variable: {"id","simbolo","nome","unidade","categoria"}
   - phenomenon: {"id","nome","descricao","entidades":[],"area","variaveis":[],"formulas":[]}
   - graph: {"id","formulaId","nome","eixosLabel","expressao","grau","area","eixoX","eixoY","parametros":[],"expressaoAvaliacao","insight","pontoDestaqueX"}
     expressaoAvaliacao: JS com x e params, ex.: "params.p0 + params.rho * params.g * x"

Regras:
- Prefira IDs existentes do CATÁLOGO ATUAL.
- Se usar um id que NÃO aparece no catálogo, OBRIGATORIAMENTE inclua uma entrada correspondente em "propostas" (mesmo id em proposedId).
- Sem propostas vazias para ids inventados: ou o id existe no catálogo, ou há proposta.
- proposedId deve ser snake_case / dotted id coerente com o catálogo.
- confidence entre 0 e 1.
- Não invente números que não estejam no enunciado.
- Responda sempre no schema JSON pedido.
- payloadJson deve ser um JSON válido (objeto), nunca vazio quando houver proposta.`;
}

export function llmDisponivel(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function soId(raw: string): string {
  const t = raw.trim();
  const m = t.match(/^([a-zA-Z0-9_.]+)/);
  return m?.[1] ?? t;
}

export async function analisarExercicioLlm(enunciado: string): Promise<AnaliseCompleta> {
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: analiseSchema,
    system: systemPrompt(),
    prompt: `CATÁLOGO ATUAL:\n${snapshotCatalogo()}\n\nENUNCIADO:\n${enunciado}`,
  });

  const propostas: PropostaCatalogo[] = object.propostas.map((p) => {
    let payload: Record<string, unknown> = { id: p.proposedId };
    try {
      const parsed = JSON.parse(p.payloadJson) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        payload = { id: p.proposedId, ...(parsed as Record<string, unknown>) };
      }
    } catch {
      payload = { id: p.proposedId, raw: p.payloadJson };
    }
    return {
      kind: p.kind,
      proposedId: soId(p.proposedId),
      confidence: p.confidence,
      payload,
    };
  });

  return {
    variaveis: object.variaveis.map(soId),
    formulas: object.formulas.map(soId),
    fenomenos: object.fenomenos.map(soId),
    graphs: object.graphs.map(soId),
    entidades: object.entidades,
    valores: object.valores.map((v) => ({ ...v, variableId: soId(v.variableId) })),
    area: object.area ?? undefined,
    confidence: object.confidence,
    resolverMethod: "llm",
    rawExtraction: {
      ...object,
      source: "openai",
    },
    computedAnswer: object.computedAnswer ?? undefined,
    computedUnit: object.computedUnit ?? undefined,
    titulo: object.titulo,
    contexto: object.contexto,
    pergunta: object.pergunta,
    dica: object.dica,
    rubrica: {
      conceitosObrigatorios: object.rubrica.conceitosObrigatorios,
      conceitosAlternativos: object.rubrica.conceitosAlternativos,
      conceitosProibidos: object.rubrica.conceitosProibidos,
      minObrigatorios: object.rubrica.minObrigatorios,
    },
    passosPreResolucao: object.passosPreResolucao,
    propostas,
  };
}

/** Heurística + LLM: divide uma lista em enunciados individuais. */
export async function dividirListaEmEnunciados(texto: string): Promise<string[]> {
  const trimmed = texto.trim();
  if (!trimmed) return [];

  if (!llmDisponivel()) {
    return dividirListaHeuristica(trimmed);
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const schema = z.object({
    enunciados: z.array(z.string()),
  });

  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema,
    system:
      "Você recebe uma lista de exercícios de física. Separe em enunciados individuais completos. Não resolva. Não invente texto.",
    prompt: trimmed.slice(0, 60_000),
  });

  const parts = object.enunciados.map((e) => e.trim()).filter(Boolean);
  return parts.length > 0 ? parts : dividirListaHeuristica(trimmed);
}

export function dividirListaHeuristica(texto: string): string[] {
  const blocs = texto
    .split(/\n\s*(?=(?:\d+[\).\-:]|[a-dA-D][\)\.]|Exerc[ií]cio|Quest[aã]o)\s+)/i)
    .map((b) => b.trim())
    .filter((b) => b.length > 20);

  if (blocs.length > 1) return blocs;
  return [texto.trim()];
}

export async function analisarExercicioPreferindoLlm(
  enunciado: string
): Promise<AnaliseCompleta> {
  if (!llmDisponivel()) {
    const regras = analisarExercicio(enunciado) as ResultadoAnalise;
    return {
      ...regras,
      graphs: [],
      propostas: [],
    };
  }

  try {
    return await analisarExercicioLlm(enunciado);
  } catch (error) {
    console.error("[ingestor] LLM falhou, fallback regras:", error);
    const regras = analisarExercicio(enunciado);
    return {
      ...regras,
      graphs: [],
      propostas: [],
    };
  }
}
