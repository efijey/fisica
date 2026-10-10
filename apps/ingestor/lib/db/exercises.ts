import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { analisarExercicioPreferindoLlm } from "@/lib/llm/analisar-exercicio";
import type {
  AnaliseCompleta,
  CatalogDraftKind,
  CatalogDraftRow,
  ExerciseListRow,
  ExerciseStatus,
  ListFonte,
  PropostaCatalogo,
} from "@/lib/types";

export function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createSupabaseClient(url, key);
}

async function persistirAnalise(
  exerciseId: string,
  analise: AnaliseCompleta,
  listId?: string | null
) {
  const supabase = getServiceClient();

  await supabase.from("exercise_analyses").upsert(
    {
      exercise_id: exerciseId,
      confidence: analise.confidence,
      resolver_method: analise.resolverMethod,
      raw_extraction: analise.rawExtraction,
      computed_answer: analise.computedAnswer ?? null,
      computed_unit: analise.computedUnit ?? null,
    },
    { onConflict: "exercise_id" }
  );

  await Promise.all([
    supabase.from("exercise_values").delete().eq("exercise_id", exerciseId),
    supabase.from("analysis_formulas").delete().eq("exercise_id", exerciseId),
    supabase.from("analysis_variables").delete().eq("exercise_id", exerciseId),
    supabase.from("analysis_phenomena").delete().eq("exercise_id", exerciseId),
    supabase.from("analysis_entities").delete().eq("exercise_id", exerciseId),
    supabase.from("analysis_graphs").delete().eq("exercise_id", exerciseId),
  ]);

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
      analise.fenomenos.map((phenomenon_id) => ({
        exercise_id: exerciseId,
        phenomenon_id,
      }))
    );
  }

  if (analise.entidades.length > 0) {
    await supabase.from("analysis_entities").insert(
      analise.entidades.map((entity) => ({ exercise_id: exerciseId, entity }))
    );
  }

  if (analise.graphs && analise.graphs.length > 0) {
    await supabase.from("analysis_graphs").insert(
      analise.graphs.map((graph_id) => ({ exercise_id: exerciseId, graph_id }))
    );
  }

  if (analise.propostas?.length) {
    await salvarPropostas(analise.propostas, exerciseId, listId ?? null);
  }
}

export async function salvarPropostas(
  propostas: PropostaCatalogo[],
  sourceExerciseId: string | null,
  sourceListId: string | null
) {
  const supabase = getServiceClient();
  if (!propostas.length) return;

  await supabase.from("catalog_drafts").insert(
    propostas.map((p) => ({
      kind: p.kind,
      proposed_id: p.proposedId,
      payload: { ...p.payload, id: p.proposedId },
      source_exercise_id: sourceExerciseId,
      source_list_id: sourceListId,
      status: "rascunho",
      confidence: p.confidence,
    }))
  );
}

export async function salvarExercicioComAnalise(
  enunciado: string,
  fonte?: string,
  opts?: { listId?: string; analisar?: boolean }
) {
  const supabase = getServiceClient();
  const analisar = opts?.analisar !== false;
  const analise = analisar
    ? await analisarExercicioPreferindoLlm(enunciado)
    : null;

  const { data: exercise, error: exerciseError } = await supabase
    .from("exercises")
    .insert({
      enunciado,
      fonte: fonte ?? null,
      status: "rascunho",
      list_id: opts?.listId ?? null,
      titulo: analise?.titulo ?? null,
      contexto: analise?.contexto ?? null,
      pergunta: analise?.pergunta ?? null,
      area: analise?.area ?? null,
      dica: analise?.dica ?? null,
      rubrica: analise?.rubrica ?? null,
    })
    .select()
    .single();

  if (exerciseError || !exercise) {
    throw new Error(exerciseError?.message ?? "Falha ao salvar exercício");
  }

  if (analise) {
    await persistirAnalise(exercise.id, analise, opts?.listId);
  }

  return { exercise, analise };
}

export async function criarLista(input: {
  titulo: string;
  fonte: ListFonte;
  rawText: string;
  storagePath?: string | null;
}): Promise<ExerciseListRow> {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("exercise_lists")
    .insert({
      titulo: input.titulo,
      fonte: input.fonte,
      raw_text: input.rawText,
      storage_path: input.storagePath ?? null,
      status: "rascunho",
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message ?? "Falha ao criar lista");
  return data as ExerciseListRow;
}

export async function listarListas() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("exercise_lists")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ExerciseListRow[];
}

export async function obterLista(id: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("exercise_lists")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as ExerciseListRow;
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
    { data: graphs },
  ] = await Promise.all([
    supabase.from("exercise_analyses").select("*").eq("exercise_id", id).maybeSingle(),
    supabase.from("exercise_values").select("*").eq("exercise_id", id),
    supabase.from("analysis_formulas").select("formula_id").eq("exercise_id", id),
    supabase.from("analysis_variables").select("variable_id").eq("exercise_id", id),
    supabase.from("analysis_phenomena").select("phenomenon_id").eq("exercise_id", id),
    supabase.from("analysis_entities").select("entity").eq("exercise_id", id),
    supabase.from("analysis_graphs").select("graph_id").eq("exercise_id", id),
  ]);

  return {
    ...exercise,
    analysis: analysis ?? undefined,
    values: values ?? [],
    formulas: formulas?.map((f) => f.formula_id) ?? [],
    variables: variables?.map((v) => v.variable_id) ?? [],
    phenomena: phenomena?.map((p) => p.phenomenon_id) ?? [],
    entities: entities?.map((e) => e.entity) ?? [],
    graphs: graphs?.map((g) => g.graph_id) ?? [],
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

export async function listarCatalogDrafts(status?: ExerciseStatus) {
  const supabase = getServiceClient();
  let query = supabase
    .from("catalog_drafts")
    .select("*")
    .order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as CatalogDraftRow[];
}

export async function obterCatalogDraft(id: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("catalog_drafts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as CatalogDraftRow;
}

export async function atualizarCatalogDraft(
  id: string,
  patch: {
    status?: ExerciseStatus;
    payload?: Record<string, unknown>;
    proposed_id?: string;
    kind?: CatalogDraftKind;
  }
) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("catalog_drafts")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as CatalogDraftRow;
}

export async function listarCatalogDraftsAprovados() {
  return listarCatalogDrafts("aprovado");
}

export async function uploadPdfLista(
  filename: string,
  bytes: ArrayBuffer | Buffer | Uint8Array
): Promise<string> {
  const supabase = getServiceClient();
  const path = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const { error } = await supabase.storage
    .from("listas-pdf")
    .upload(path, bytes, { contentType: "application/pdf", upsert: false });
  if (error) throw new Error(error.message);
  return path;
}
