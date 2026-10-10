/** Gerado por apps/ingestor/scripts/export-catalog.ts — não edite à mão. */

import type { VisualizacaoGrafico } from "../physics/graficos/catalog";
import {
  materializarGrafico,
  type GraficoSerializado,
} from "../physics/graficos/serializado";

export const graficosGeradosSerializados: GraficoSerializado[] = [];

export const graficosGerados: VisualizacaoGrafico[] =
  graficosGeradosSerializados.map(materializarGrafico);
