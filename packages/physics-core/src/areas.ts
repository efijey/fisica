import type { AreaFisica } from "./physics/formulas/catalog";

export const AREA_LABEL: Record<AreaFisica, string> = {
  cinematica: "Cinemática",
  dinamica: "Dinâmica",
  energia: "Energia",
  momento: "Momento",
  rotacao: "Rotação",
  gravitacao: "Gravitação",
};

export const AREA_COLOR: Record<AreaFisica, string> = {
  cinematica: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  dinamica: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  energia: "bg-green-500/10 text-green-600 border-green-500/20",
  momento: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  rotacao: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  gravitacao: "bg-red-500/10 text-red-600 border-red-500/20",
};

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
];
