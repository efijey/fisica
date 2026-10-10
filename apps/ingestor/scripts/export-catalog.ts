import { config } from "dotenv";
import { writeFileSync, mkdirSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(__dirname, "../.env.local") });
config({ path: resolve(__dirname, "../.env") });
function esc(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar exercícios:", error.message);
    process.exit(1);
  }

  const exemplos = [];
  const problemas = [];

  for (const exercise of exercises ?? []) {
    const [
      { data: formulas },
      { data: variables },
      { data: phenomena },
      { data: entities },
      { data: graphs },
    ] = await Promise.all([
      supabase.from("analysis_formulas").select("formula_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_variables").select("variable_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_phenomena").select("phenomenon_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_entities").select("entity").eq("exercise_id", exercise.id),
      supabase.from("analysis_graphs").select("graph_id").eq("exercise_id", exercise.id),
    ]);

    const formulaIds = formulas?.map((f) => f.formula_id) ?? [];
    const variableIds = variables?.map((v) => v.variable_id) ?? [];
    const phenomenonIds = phenomena?.map((p) => p.phenomenon_id) ?? [];
    const entityIds = entities?.map((e) => e.entity) ?? [];
    const graphIds = graphs?.map((g) => g.graph_id) ?? [];

    exemplos.push({
      id: exercise.id,
      enunciado: exercise.enunciado,
      formulas: formulaIds,
      variaveis: variableIds,
      fenomenos: phenomenonIds,
      entidades: entityIds,
      graficos: graphIds,
      area: exercise.area ?? undefined,
    });

    const rubrica = exercise.rubrica ?? {
      conceitosObrigatorios: [],
      minObrigatorios: 1,
    };

    problemas.push({
      id: exercise.id,
      titulo: exercise.titulo || `Exercício ${exercise.id.slice(0, 8)}`,
      contexto: exercise.contexto || exercise.enunciado,
      pergunta:
        exercise.pergunta ||
        "Explique, em palavras, como você resolveria este problema e quais grandezas usaria.",
      area: exercise.area || "cinematica",
      formulas: formulaIds,
      variaveis: variableIds,
      fenomenos: phenomenonIds,
      rubrica,
      dica: exercise.dica || "Revise as fórmulas e grandezas relacionadas ao enunciado.",
    });
  }

  const exemplosPath = resolve(
    __dirname,
    "../../explicadora/app/physics/examples/catalog.ts"
  );

  writeFileSync(
    exemplosPath,
    `// Gerado automaticamente por apps/ingestor/scripts/export-catalog.ts
// Não edite manualmente — rode: npm run export-catalog

import type { AreaFisica } from "@fisica/physics-core";

export interface ExemploExercicio {
  id: string;
  enunciado: string;
  formulas: string[];
  variaveis: string[];
  fenomenos: string[];
  entidades: string[];
  graficos?: string[];
  area?: AreaFisica | string;
}

export const catalogoExemplos: ExemploExercicio[] = ${esc(exemplos)};
`,
    "utf-8"
  );

  const problemasGenPath = resolve(
    __dirname,
    "../../explicadora/app/physics/problemas/catalog.generated.ts"
  );

  writeFileSync(
    problemasGenPath,
    `// Gerado automaticamente por apps/ingestor/scripts/export-catalog.ts
// Não edite manualmente — rode: npm run export-catalog

import type { ProblemaConceitual } from "./catalog";

export const catalogoProblemasGerados: ProblemaConceitual[] = ${esc(problemas)} as ProblemaConceitual[];
`,
    "utf-8"
  );

  const { data: drafts, error: draftsError } = await supabase
    .from("catalog_drafts")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: true });

  if (draftsError) {
    console.error("Erro ao buscar catalog_drafts:", draftsError.message);
    process.exit(1);
  }

  const areas: Record<string, string> = {};
  const areaColors: Record<string, string> = {};
  const areaNav: { valor: string; label: string; emoji: string }[] = [];
  const formulas: unknown[] = [];
  const variables: unknown[] = [];
  const phenomena: unknown[] = [];
  const graphs: unknown[] = [];
  const areaIds: string[] = [];

  for (const draft of drafts ?? []) {
    const payload = (draft.payload ?? {}) as Record<string, unknown>;
    const id = String(draft.proposed_id || payload.id || "");
    if (!id) continue;

    switch (draft.kind) {
      case "area": {
        const label = String(payload.label ?? id);
        const color = String(
          payload.color ?? "bg-zinc-500/10 text-zinc-700 border-zinc-500/20"
        );
        const emoji = String(payload.emoji ?? "📘");
        areas[id] = label;
        areaColors[id] = color;
        areaNav.push({ valor: id, label, emoji });
        areaIds.push(id);
        break;
      }
      case "formula":
        formulas.push({
          id,
          nome: payload.nome ?? id,
          expressaoPrincipal: payload.expressaoPrincipal ?? "",
          area: payload.area ?? "cinematica",
          variaveis: payload.variaveis ?? [],
          descricao: payload.descricao,
          variacoes: payload.variacoes ?? [],
        });
        break;
      case "variable":
        variables.push({
          id,
          simbolo: payload.simbolo ?? id,
          nome: payload.nome ?? id,
          unidade: payload.unidade ?? "",
          categoria: payload.categoria ?? payload.area ?? "cinematica",
        });
        break;
      case "phenomenon":
        phenomena.push({
          id,
          nome: payload.nome ?? id,
          descricao: payload.descricao ?? "",
          entidades: payload.entidades ?? [],
          area: payload.area ?? "cinematica",
          variaveis: payload.variaveis ?? [],
          formulas: payload.formulas ?? [],
        });
        break;
      case "graph":
        graphs.push({
          id,
          formulaId: payload.formulaId ?? "",
          nome: payload.nome ?? id,
          eixosLabel: payload.eixosLabel ?? "",
          expressao: payload.expressao ?? "",
          grau: payload.grau ?? 1,
          area: payload.area ?? "cinematica",
          eixoX: payload.eixoX ?? {
            simbolo: "x",
            nome: "x",
            unidade: "",
            min: 0,
            max: 10,
            amostras: 80,
          },
          eixoY: payload.eixoY ?? { simbolo: "y", nome: "y", unidade: "" },
          parametros: payload.parametros ?? [],
          expressaoAvaliacao: payload.expressaoAvaliacao ?? "0",
          insight: payload.insight ?? "",
          pontoDestaqueX: payload.pontoDestaqueX ?? 0,
        });
        break;
    }
  }

  const genDir = resolve(__dirname, "../../../packages/physics-core/src/generated");
  mkdirSync(genDir, { recursive: true });

  const areaUnion =
    areaIds.length > 0
      ? areaIds.map((a) => JSON.stringify(a)).join(" | ")
      : "never";

  writeFileSync(
    resolve(genDir, "areas.ts"),
    `/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

export type AreaFisicaGerada = ${areaUnion};

export const areasGeradasLabels: Record<string, string> = ${esc(areas)};

export const areasGeradasColors: Record<string, string> = ${esc(areaColors)};

export const areasGeradasNavegacao: {
  valor: string;
  label: string;
  emoji: string;
}[] = ${esc(areaNav)};
`,
    "utf-8"
  );

  writeFileSync(
    resolve(genDir, "formulas.ts"),
    `/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

import type { Formula } from "../physics/formulas/catalog";

export const formulasGeradas: Formula[] = ${esc(formulas)} as Formula[];
`,
    "utf-8"
  );

  writeFileSync(
    resolve(genDir, "variables.ts"),
    `/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

import type { VariavelFisica } from "../physics/variables/catalog";

export const variaveisGeradas: VariavelFisica[] = ${esc(variables)} as VariavelFisica[];
`,
    "utf-8"
  );

  writeFileSync(
    resolve(genDir, "phenomena.ts"),
    `/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

import type { Fenomeno } from "../physics/phenomena/catalog";

export const fenomenosGerados: Fenomeno[] = ${esc(phenomena)} as Fenomeno[];
`,
    "utf-8"
  );

  writeFileSync(
    resolve(genDir, "graficos.ts"),
    `/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

import type { VisualizacaoGrafico } from "../physics/graficos/catalog";
import {
  materializarGrafico,
  type GraficoSerializado,
} from "../physics/graficos/serializado";

export const graficosGeradosSerializados: GraficoSerializado[] = ${esc(
      graphs
    )} as GraficoSerializado[];

export const graficosGerados: VisualizacaoGrafico[] =
  graficosGeradosSerializados.map(materializarGrafico);
`,
    "utf-8"
  );

  const exerciseIds = (exercises ?? []).map((e) => e.id);
  if (exerciseIds.length > 0) {
    await supabase
      .from("exercises")
      .update({ status: "publicado" })
      .in("id", exerciseIds);
  }

  const draftIds = (drafts ?? []).map((d) => d.id);
  if (draftIds.length > 0) {
    await supabase
      .from("catalog_drafts")
      .update({ status: "publicado" })
      .in("id", draftIds);
  }

  console.log(`Exportados ${exemplos.length} exemplos → ${exemplosPath}`);
  console.log(`Exportados ${problemas.length} problemas → ${problemasGenPath}`);
  console.log(
    `Exportados drafts: ${formulas.length} fórmulas, ${variables.length} variáveis, ${phenomena.length} fenômenos, ${graphs.length} gráficos, ${areaIds.length} áreas`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
