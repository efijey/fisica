import {
  catalogoFenomenos,
  catalogoVariaveis,
  inferirFormulas,
  type AreaFisica,
} from "@fisica/physics-core";

export interface ValorExtraido {
  variableId: string;
  value: number;
  unit: string;
  role: "dado" | "incognita";
}

export interface ResultadoAnalise {
  variaveis: string[];
  formulas: string[];
  fenomenos: string[];
  entidades: string[];
  valores: ValorExtraido[];
  area?: AreaFisica;
  confidence: number;
  resolverMethod: "regras";
  rawExtraction: Record<string, unknown>;
  computedAnswer?: number;
  computedUnit?: string;
}

const SINONIMOS_VARIAVEL: Record<string, string[]> = {
  "aceleracao.modulo": ["aceleração", "aceleracao", "acelera"],
  "aceleracao.centripeta": ["aceleração centrípeta", "aceleracao centripeta", "ac"],
  "massa.modulo": ["massa"],
  "forca.resultante": ["força resultante", "forca resultante", "força", "forca"],
  "forca.modulo": ["força", "forca"],
  "peso.modulo": ["peso"],
  "velocidade.modulo": ["velocidade"],
  "velocidade.inicial": ["velocidade inicial", "v0", "v₀"],
  "velocidade.final": ["velocidade final"],
  "velocidade.media": ["velocidade média", "velocidade media"],
  "tempo.modulo": ["tempo"],
  "tempo.delta": ["intervalo de tempo", "delta t", "Δt"],
  "posicao.delta": ["deslocamento", "distância", "distancia"],
  "energiaCinetica.modulo": ["energia cinética", "energia cinetica"],
  "trabalho.modulo": ["trabalho"],
  "impulso.modulo": ["impulso"],
  "momentoLinear.modulo": ["momento linear", "quantidade de movimento"],
};

const UNIDADE_PARA_VARIAVEL: Record<string, string> = {
  "m/s²": "aceleracao.modulo",
  "m/s2": "aceleracao.modulo",
  "m/s": "velocidade.modulo",
  "km/h": "velocidade.modulo",
  kg: "massa.modulo",
  n: "forca.modulo",
  s: "tempo.modulo",
  m: "posicao.modulo",
  j: "energiaCinetica.modulo",
};

const PERGUNTA_PATTERNS: { regex: RegExp; variableId: string }[] = [
  { regex: /qual\s+(?:é\s+)?a\s+força/i, variableId: "forca.resultante" },
  { regex: /qual\s+(?:é\s+)?a\s+acelera/i, variableId: "aceleracao.modulo" },
  { regex: /qual\s+(?:é\s+)?a\s+velocidade/i, variableId: "velocidade.modulo" },
  { regex: /qual\s+(?:é\s+)?a\s+massa/i, variableId: "massa.modulo" },
  { regex: /determine\s+a\s+força/i, variableId: "forca.resultante" },
  { regex: /calcule\s+a\s+força/i, variableId: "forca.resultante" },
  { regex: /determine\s+a\s+acelera/i, variableId: "aceleracao.modulo" },
  { regex: /calcule\s+a\s+velocidade/i, variableId: "velocidade.modulo" },
];

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extrairValores(texto: string): ValorExtraido[] {
  const valores: ValorExtraido[] = [];
  const regex = /(\d+(?:[.,]\d+)?)\s*([a-zA-Z°·²³\/\u00B2\u00B3]+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(texto)) !== null) {
    const value = parseFloat(match[1].replace(",", "."));
    const unit = match[2].toLowerCase().replace("²", "2").replace("³", "3");
    const variableId = UNIDADE_PARA_VARIAVEL[unit];
    if (!variableId || Number.isNaN(value)) continue;

    valores.push({
      variableId,
      value,
      unit: match[2],
      role: "dado",
    });
  }

  return valores;
}

function extrairVariaveisPorTexto(texto: string): string[] {
  const normalizado = normalizar(texto);
  const encontradas = new Set<string>();

  for (const [variableId, sinonimos] of Object.entries(SINONIMOS_VARIAVEL)) {
    for (const sinonimo of sinonimos) {
      if (normalizado.includes(normalizar(sinonimo))) {
        encontradas.add(variableId);
      }
    }
  }

  return [...encontradas];
}

function extrairIncognita(texto: string): string | undefined {
  for (const { regex, variableId } of PERGUNTA_PATTERNS) {
    if (regex.test(texto)) return variableId;
  }
  return undefined;
}

function extrairEntidades(texto: string): string[] {
  const normalizado = normalizar(texto);
  const entidades = new Set<string>();

  for (const fenomeno of catalogoFenomenos) {
    for (const entidade of fenomeno.entidades) {
      if (normalizado.includes(normalizar(entidade))) {
        entidades.add(entidade);
      }
    }
  }

  return [...entidades];
}

function inferirFenomenos(
  variaveis: string[],
  entidades: string[],
  formulas: string[]
): string[] {
  const ids = new Set<string>();

  for (const fenomeno of catalogoFenomenos) {
    const matchEntidade = fenomeno.entidades.some((e) => entidades.includes(e));
    const matchFormula = fenomeno.formulas.some((f) => formulas.includes(f));
    const matchVariavel =
      fenomeno.variaveis.filter((v) => variaveis.includes(v)).length >= 2;

    if (matchEntidade || matchFormula || matchVariavel) {
      ids.add(fenomeno.id);
    }
  }

  return [...ids];
}

function calcularRespostaInterna(
  formulaId: string,
  valores: ValorExtraido[],
  incognita?: string
): { answer?: number; unit?: string } {
  if (!incognita) return {};

  if (formulaId === "segunda_lei_newton" && incognita === "forca.resultante") {
    const m = valores.find((v) => v.variableId === "massa.modulo");
    const a = valores.find((v) => v.variableId === "aceleracao.modulo");
    if (m && a) return { answer: m.value * a.value, unit: "N" };
  }

  if (formulaId === "segunda_lei_newton" && incognita === "aceleracao.modulo") {
    const m = valores.find((v) => v.variableId === "massa.modulo");
    const f = valores.find(
      (v) => v.variableId === "forca.resultante" || v.variableId === "forca.modulo"
    );
    if (m && f) return { answer: f.value / m.value, unit: "m/s²" };
  }

  if (formulaId === "forca_peso" && incognita === "peso.modulo") {
    const m = valores.find((v) => v.variableId === "massa.modulo");
    if (m) return { answer: m.value * 9.8, unit: "N" };
  }

  return {};
}

function calcularConfianca(
  variaveis: string[],
  formulas: string[],
  valores: ValorExtraido[],
  incognita?: string
): number {
  let score = 0.3;

  if (variaveis.length >= 2) score += 0.2;
  if (formulas.length >= 1) score += 0.25;
  if (valores.length >= 1) score += 0.15;
  if (incognita) score += 0.1;

  return Math.min(score, 0.95);
}

export function analisarExercicio(enunciado: string): ResultadoAnalise {
  const valoresBrutos = extrairValores(enunciado);
  const incognita = extrairIncognita(enunciado);

  const variaveisTexto = extrairVariaveisPorTexto(enunciado);
  const variaveisValores = valoresBrutos.map((v) => v.variableId);

  const variaveis = [
    ...new Set([
      ...variaveisTexto,
      ...variaveisValores,
      ...(incognita ? [incognita] : []),
    ]),
  ];

  const valores = valoresBrutos.map((v) => ({
    ...v,
    role: incognita && v.variableId === incognita ? ("incognita" as const) : v.role,
  }));

  if (incognita && !valores.some((v) => v.variableId === incognita)) {
    valores.push({
      variableId: incognita,
      value: 0,
      unit: catalogoVariaveis.find((v) => v.id === incognita)?.unidade ?? "",
      role: "incognita",
    });
  }

  const variaveisConhecidas = variaveis.filter((v) => v !== incognita);
  const inferencias = inferirFormulas(variaveisConhecidas);
  const formulas = inferencias.map((r) => r.formula.id);

  const entidades = extrairEntidades(enunciado);
  const fenomenos = inferirFenomenos(variaveis, entidades, formulas);

  const formulaPrincipal = formulas[0];
  const { answer, unit } = formulaPrincipal
    ? calcularRespostaInterna(formulaPrincipal, valores, incognita)
    : {};

  const area = inferencias[0]?.formula.area;

  return {
    variaveis,
    formulas,
    fenomenos,
    entidades,
    valores,
    area,
    confidence: calcularConfianca(variaveis, formulas, valores, incognita),
    resolverMethod: "regras",
    rawExtraction: {
      incognita,
      variaveisTexto,
      variaveisValores,
      valoresBrutos,
    },
    computedAnswer: answer,
    computedUnit: unit,
  };
}
