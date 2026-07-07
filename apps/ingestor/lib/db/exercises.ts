import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { analisarExercicio } from "@/lib/parser/analisar";
import type { ExerciseStatus } from "@/lib/types";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createSupabaseClient(url, key);
}

export async function salvarExercicioComAnalise(
  enunciado: string,
  fonte?: string
) {
  const supabase = getServiceClient();
  const analise = analisarExercicio(enunciado);

  const { data: exercise, error: exerciseError } = await supabase
    .from("exercises")
    .insert({
      enunciado,
      fonte: fonte ?? null,
      status: "rascunho",
    })
    .select()
    .single();

  if (exerciseError || !exercise) {
    throw new Error(exerciseError?.message ?? "Falha ao salvar exercício");
  }

  const exerciseId = exercise.id;

  await supabase.from("exercise_analyses").insert({
    exercise_id: exerciseId,
    confidence: analise.confidence,
    resolver_method: analise.resolverMethod,
    raw_extraction: analise.rawExtraction,
    computed_answer: analise.computedAnswer ?? null,
    computed_unit: analise.computedUnit ?? null,
  });

  if (analise.valores.length > 0) {
    await supabase.from("exercise_values").insert(
      analise.valores.map((v) => ({
        exercise_id: exerciseId,
        variable_id: v.variableId,
        value: v.value,
        unit: v.unit,
        role: v.role,
      }))
    );
  }

  if (analise.formulas.length > 0) {
    await supabase.from("analysis_formulas").insert(
      analise.formulas.map((formula_id) => ({ exercise_id: exerciseId, formula_id }))
    );
  }

  if (analise.variaveis.length > 0) {
    await supabase.from("analysis_variables").insert(
      analise.variaveis.map((variable_id) => ({ exercise_id: exerciseId, variable_id }))
    );
  }

  if (analise.fenomenos.length > 0) {
    await supabase.from("analysis_phenomena").insert(
      analise.fenomenos.map((phenomenon_id) => ({ exercise_id: exerciseId, phenomenon_id }))
    );
  }

  if (analise.entidades.length > 0) {
    await supabase.from("analysis_entities").insert(
      analise.entidades.map((entity) => ({ exercise_id: exerciseId, entity }))
    );
  }

  return { exercise, analise };
}

export async function listarExercicios(status?: ExerciseStatus) {
  const supabase = getServiceClient();

  let query = supabase
    .from("exercises")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function obterExercicioCompleto(id: string) {
  const supabase = getServiceClient();

  const { data: exercise, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !exercise) return null;

  const [
    { data: analysis },
    { data: values },
    { data: formulas },
    { data: variables },
    { data: phenomena },
    { data: entities },
  ] = await Promise.all([
    supabase.from("exercise_analyses").select("*").eq("exercise_id", id).maybeSingle(),
    supabase.from("exercise_values").select("*").eq("exercise_id", id),
    supabase.from("analysis_formulas").select("formula_id").eq("exercise_id", id),
    supabase.from("analysis_variables").select("variable_id").eq("exercise_id", id),
    supabase.from("analysis_phenomena").select("phenomenon_id").eq("exercise_id", id),
    supabase.from("analysis_entities").select("entity").eq("exercise_id", id),
  ]);

  return {
    ...exercise,
    analysis: analysis ?? undefined,
    values: values ?? [],
    formulas: formulas?.map((f) => f.formula_id) ?? [],
    variables: variables?.map((v) => v.variable_id) ?? [],
    phenomena: phenomena?.map((p) => p.phenomenon_id) ?? [],
    entities: entities?.map((e) => e.entity) ?? [],
  };
}

export async function atualizarStatusExercicio(id: string, status: ExerciseStatus) {
  const supabase = getServiceClient();

  const { data, error } = await supabase
    .from("exercises")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function listarExerciciosAprovados() {
  const supabase = getServiceClient();

  const { data: exercises, error } = await supabase
    .from("exercises")
    .select("*")
    .eq("status", "aprovado")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  if (!exercises?.length) return [];

  const results = [];
  for (const exercise of exercises) {
    const completo = await obterExercicioCompleto(exercise.id);
    if (completo) results.push(completo);
  }

  return results;
}
