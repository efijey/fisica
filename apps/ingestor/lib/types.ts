import type { AreaFisica } from "@fisica/physics-core";
import type { ResultadoAnalise } from "@/lib/parser/analisar";

export type ExerciseStatus = "rascunho" | "aprovado" | "rejeitado" | "publicado";
export type ListFonte = "texto" | "pdf";
export type CatalogDraftKind =
  | "area"
  | "formula"
  | "variable"
  | "phenomenon"
  | "graph";

export interface RubricaProblema {
  conceitosObrigatorios: string[];
  conceitosAlternativos?: string[];
  conceitosProibidos?: string[];
  minObrigatorios: number;
}

export interface ExerciseRow {
  id: string;
  enunciado: string;
  fonte: string | null;
  status: ExerciseStatus;
  list_id: string | null;
  titulo: string | null;
  contexto: string | null;
  pergunta: string | null;
  area: string | null;
  dica: string | null;
  rubrica: RubricaProblema | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseListRow {
  id: string;
  titulo: string;
  fonte: ListFonte;
  raw_text: string;
  storage_path: string | null;
  status: ExerciseStatus;
  created_at: string;
  updated_at: string;
}

export interface CatalogDraftRow {
  id: string;
  kind: CatalogDraftKind;
  proposed_id: string;
  payload: Record<string, unknown>;
  source_exercise_id: string | null;
  source_list_id: string | null;
  status: ExerciseStatus;
  confidence: number;
  created_at: string;
  updated_at: string;
}

export interface ExerciseWithAnalysis extends ExerciseRow {
  analysis?: {
    confidence: number;
    resolver_method: string;
    computed_answer: number | null;
    computed_unit: string | null;
    raw_extraction: Record<string, unknown>;
  };
  formulas: string[];
  variables: string[];
  phenomena: string[];
  entities: string[];
  graphs: string[];
  values: {
    variable_id: string;
    value: number;
    unit: string | null;
    role: string;
  }[];
}

export interface AnaliseCompleta extends Omit<ResultadoAnalise, "area" | "resolverMethod"> {
  resolverMethod: "regras" | "llm";
  graphs?: string[];
  titulo?: string;
  contexto?: string;
  pergunta?: string;
  dica?: string;
  rubrica?: RubricaProblema;
  passosPreResolucao?: string[];
  propostas?: PropostaCatalogo[];
  area?: AreaFisica | string;
}

export interface PropostaCatalogo {
  kind: CatalogDraftKind;
  proposedId: string;
  confidence: number;
  payload: Record<string, unknown>;
}
