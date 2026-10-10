import type { AreaFisica } from "./physics/formulas/catalog";
import {
  areasGeradasColors,
  areasGeradasLabels,
  areasGeradasNavegacao,
} from "./generated/areas";

const AREA_LABEL_BASE: Record<string, string> = {
  cinematica: "Cinemática",
  dinamica: "Dinâmica",
  energia: "Energia",
  momento: "Momento",
  rotacao: "Rotação",
  gravitacao: "Gravitação",
  hidrostatica: "Hidrostática",
  termodinamica: "Termodinâmica",
  ondas: "Ondas",
  eletromagnetismo: "Eletromagnetismo",
};

const AREA_COLOR_BASE: Record<string, string> = {
  cinematica: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  dinamica: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  energia: "bg-green-500/10 text-green-600 border-green-500/20",
  momento: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  rotacao: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  gravitacao: "bg-red-500/10 text-red-600 border-red-500/20",
  hidrostatica: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20",
  termodinamica: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  ondas: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
  eletromagnetismo: "bg-amber-500/10 text-amber-700 border-amber-500/20",
};

export const AREA_LABEL: Record<string, string> = {
  ...AREA_LABEL_BASE,
  ...areasGeradasLabels,
};

export const AREA_COLOR: Record<string, string> = {
  ...AREA_COLOR_BASE,
  ...areasGeradasColors,
};

export function labelArea(area: string): string {
  return AREA_LABEL[area] ?? area;
}

export const AREAS_NAVEGACAO: {
  valor: AreaFisica | "todas";
  label: string;
  emoji: string;
}[] = [
  { valor: "todas", label: "Todas", emoji: "📚" },
  { valor: "cinematica", label: "Cinemática", emoji: "🏃" },
  { valor: "dinamica", label: "Dinâmica", emoji: "⚙️" },
  { valor: "energia", label: "Energia", emoji: "⚡" },
  { valor: "momento", label: "Momento", emoji: "💥" },
  { valor: "rotacao", label: "Rotação", emoji: "🔄" },
  { valor: "gravitacao", label: "Gravitação", emoji: "🌍" },
  { valor: "hidrostatica", label: "Hidrostática", emoji: "💧" },
  { valor: "termodinamica", label: "Termodinâmica", emoji: "🔥" },
  { valor: "ondas", label: "Ondas", emoji: "🌊" },
  { valor: "eletromagnetismo", label: "Eletromagnetismo", emoji: "🧲" },
  ...areasGeradasNavegacao.map((a) => ({
    valor: a.valor as AreaFisica,
    label: a.label,
    emoji: a.emoji,
  })),
];
