import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

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
    .select("id, enunciado, status")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar exercícios:", error.message);
    process.exit(1);
  }

  const exemplos = [];

  for (const exercise of exercises ?? []) {
    const [
      { data: formulas },
      { data: variables },
      { data: phenomena },
      { data: entities },
    ] = await Promise.all([
      supabase.from("analysis_formulas").select("formula_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_variables").select("variable_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_phenomena").select("phenomenon_id").eq("exercise_id", exercise.id),
      supabase.from("analysis_entities").select("entity").eq("exercise_id", exercise.id),
    ]);

    exemplos.push({
      id: exercise.id,
      enunciado: exercise.enunciado,
      formulas: formulas?.map((f) => f.formula_id) ?? [],
      variaveis: variables?.map((v) => v.variable_id) ?? [],
      fenomenos: phenomena?.map((p) => p.phenomenon_id) ?? [],
      entidades: entities?.map((e) => e.entity) ?? [],
    });
  }

  const outputPath = resolve(
    __dirname,
    "../../explicadora/app/physics/examples/catalog.ts"
  );

  const content = `// Gerado automaticamente por apps/ingestor/scripts/export-catalog.ts
// Não edite manualmente — rode: npm run export-catalog

import type { AreaFisica } from "@fisica/physics-core";

export interface ExemploExercicio {
  id: string;
  enunciado: string;
  formulas: string[];
  variaveis: string[];
  fenomenos: string[];
  entidades: string[];
  area?: AreaFisica;
}

export const catalogoExemplos: ExemploExercicio[] = ${JSON.stringify(exemplos, null, 2)};
`;

  writeFileSync(outputPath, content, "utf-8");

  const ids = exercises?.map((e) => e.id) ?? [];
  if (ids.length > 0) {
    await supabase
      .from("exercises")
      .update({ status: "publicado" })
      .in("id", ids);
  }

  console.log(`Exportados ${exemplos.length} exercícios para ${outputPath}`);
}

main();
