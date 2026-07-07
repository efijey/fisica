export type ExerciseStatus = "rascunho" | "aprovado" | "rejeitado" | "publicado";

export interface ExerciseRow {
  id: string;
  enunciado: string;
  fonte: string | null;
  status: ExerciseStatus;
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
  values: {
    variable_id: string;
    value: number;
    unit: string | null;
    role: string;
  }[];
}
