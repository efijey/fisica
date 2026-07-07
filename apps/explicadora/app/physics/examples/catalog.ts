// Populado via: npm run export-catalog (apps/ingestor)

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

export const catalogoExemplos: ExemploExercicio[] = [];
