import type { AreaFisica } from "../formulas/catalog";

export type GrauEquacao = 1 | 2;

export interface EixoGrafico {
  simbolo: string;
  nome: string;
  unidade: string;
  min: number;
  max: number;
  /** Quantidade de amostras ao longo do eixo X (default 80). */
  amostras?: number;
}

export interface ParametroGrafico {
  id: string;
  simbolo: string;
  nome: string;
  unidade: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

export interface VisualizacaoGrafico {
  id: string;
  formulaId: string;
  nome: string;
  /** Rótulo curto para a lista (ex.: "s × t"). */
  eixosLabel: string;
  expressao: string;
  grau: GrauEquacao;
  area: AreaFisica;
  eixoX: EixoGrafico;
  eixoY: Omit<EixoGrafico, "min" | "max" | "amostras">;
  parametros: ParametroGrafico[];
  avaliar: (x: number, params: Record<string, number>) => number;
  /** O que a forma (reta/parábola) revela fisicamente. */
  insight: string;
  /** Valor de x para o ponto destacado no gráfico. */
  pontoDestaqueX: number;
}

export const GRAU_LABEL: Record<GrauEquacao, string> = {
  1: "1º grau",
  2: "2º grau",
};

export const catalogoGraficos: VisualizacaoGrafico[] = [
  // ==================== 1º GRAU ====================
  {
    id: "mru_s_t",
    formulaId: "mru_posicao_final",
    nome: "Posição × tempo (MRU)",
    eixosLabel: "s × t",
    expressao: "s = s₀ + v·t",
    grau: 1,
    area: "cinematica",
    eixoX: {
      simbolo: "t",
      nome: "Tempo",
      unidade: "s",
      min: 0,
      max: 10,
      amostras: 80,
    },
    eixoY: { simbolo: "s", nome: "Posição", unidade: "m" },
    parametros: [
      {
        id: "s0",
        simbolo: "s₀",
        nome: "Posição inicial",
        unidade: "m",
        min: -20,
        max: 20,
        step: 1,
        default: 0,
      },
      {
        id: "v",
        simbolo: "v",
        nome: "Velocidade",
        unidade: "m/s",
        min: -10,
        max: 10,
        step: 0.5,
        default: 2,
      },
    ],
    avaliar: (t, p) => p.s0 + p.v * t,
    insight:
      "A curva é uma reta: movimento de 1º grau. A inclinação é a velocidade — quanto mais inclinada, maior |v|. Alterar s₀ apenas desloca a reta para cima ou para baixo.",
    pontoDestaqueX: 2,
  },
  {
    id: "mruv_v_t",
    formulaId: "mruv_velocidade_final",
    nome: "Velocidade × tempo (MRUV)",
    eixosLabel: "v × t",
    expressao: "v = v₀ + a·t",
    grau: 1,
    area: "cinematica",
    eixoX: {
      simbolo: "t",
      nome: "Tempo",
      unidade: "s",
      min: 0,
      max: 10,
      amostras: 80,
    },
    eixoY: { simbolo: "v", nome: "Velocidade", unidade: "m/s" },
    parametros: [
      {
        id: "v0",
        simbolo: "v₀",
        nome: "Velocidade inicial",
        unidade: "m/s",
        min: -10,
        max: 10,
        step: 0.5,
        default: 0,
      },
      {
        id: "a",
        simbolo: "a",
        nome: "Aceleração",
        unidade: "m/s²",
        min: -5,
        max: 5,
        step: 0.25,
        default: 1,
      },
    ],
    avaliar: (t, p) => p.v0 + p.a * t,
    insight:
      "No MRUV a velocidade cresce (ou decresce) linearmente com o tempo. A inclinação da reta é a aceleração: a > 0 sobe; a < 0 desce.",
    pontoDestaqueX: 2,
  },
  {
    id: "hooke_fe_x",
    formulaId: "forca_elastica",
    nome: "Força elástica × deformação",
    eixosLabel: "Fe × x",
    expressao: "Fe = k·x",
    grau: 1,
    area: "dinamica",
    eixoX: {
      simbolo: "x",
      nome: "Deformação",
      unidade: "m",
      min: -0.5,
      max: 0.5,
      amostras: 80,
    },
    eixoY: { simbolo: "Fe", nome: "Força elástica", unidade: "N" },
    parametros: [
      {
        id: "k",
        simbolo: "k",
        nome: "Constante elástica",
        unidade: "N/m",
        min: 10,
        max: 200,
        step: 5,
        default: 50,
      },
    ],
    avaliar: (x, p) => p.k * x,
    insight:
      "Lei de Hooke é linear: Fe proporcional a x. A inclinação da reta é k — molas mais rígidas geram retas mais íngremes.",
    pontoDestaqueX: 0.2,
  },
  {
    id: "newton_f_a",
    formulaId: "segunda_lei_newton",
    nome: "Força × aceleração (2ª lei)",
    eixosLabel: "F × a",
    expressao: "F = m·a",
    grau: 1,
    area: "dinamica",
    eixoX: {
      simbolo: "a",
      nome: "Aceleração",
      unidade: "m/s²",
      min: -5,
      max: 5,
      amostras: 80,
    },
    eixoY: { simbolo: "F", nome: "Força resultante", unidade: "N" },
    parametros: [
      {
        id: "m",
        simbolo: "m",
        nome: "Massa",
        unidade: "kg",
        min: 0.5,
        max: 20,
        step: 0.5,
        default: 2,
      },
    ],
    avaliar: (a, p) => p.m * a,
    insight:
      "Com massa fixa, F cresce linearmente com a. A inclinação é a massa: corpos mais pesados exigem mais força para a mesma aceleração.",
    pontoDestaqueX: 2,
  },

  // ==================== 2º GRAU ====================
  {
    id: "mruv_s_t",
    formulaId: "mruv_posicao_final",
    nome: "Posição × tempo (MRUV)",
    eixosLabel: "s × t",
    expressao: "s = s₀ + v₀·t + ½·a·t²",
    grau: 2,
    area: "cinematica",
    eixoX: {
      simbolo: "t",
      nome: "Tempo",
      unidade: "s",
      min: 0,
      max: 8,
      amostras: 100,
    },
    eixoY: { simbolo: "s", nome: "Posição", unidade: "m" },
    parametros: [
      {
        id: "s0",
        simbolo: "s₀",
        nome: "Posição inicial",
        unidade: "m",
        min: -10,
        max: 20,
        step: 1,
        default: 0,
      },
      {
        id: "v0",
        simbolo: "v₀",
        nome: "Velocidade inicial",
        unidade: "m/s",
        min: -5,
        max: 10,
        step: 0.5,
        default: 2,
      },
      {
        id: "a",
        simbolo: "a",
        nome: "Aceleração",
        unidade: "m/s²",
        min: -4,
        max: 4,
        step: 0.25,
        default: 1,
      },
    ],
    avaliar: (t, p) => p.s0 + p.v0 * t + 0.5 * p.a * t * t,
    insight:
      "Aqui a posição é de 2º grau em t: a curva é uma parábola. A aceleração controla a curvatura; v₀ inclina o início; s₀ desloca verticalmente. Compare com o MRU (reta) para sentir a diferença de grau.",
    pontoDestaqueX: 2,
  },
  {
    id: "ec_v",
    formulaId: "energia_cinetica",
    nome: "Energia cinética × velocidade",
    eixosLabel: "Ec × v",
    expressao: "Ec = ½·m·v²",
    grau: 2,
    area: "energia",
    eixoX: {
      simbolo: "v",
      nome: "Velocidade",
      unidade: "m/s",
      min: -10,
      max: 10,
      amostras: 100,
    },
    eixoY: { simbolo: "Ec", nome: "Energia cinética", unidade: "J" },
    parametros: [
      {
        id: "m",
        simbolo: "m",
        nome: "Massa",
        unidade: "kg",
        min: 0.5,
        max: 10,
        step: 0.5,
        default: 2,
      },
    ],
    avaliar: (v, p) => 0.5 * p.m * v * v,
    insight:
      "Ec depende de v²: parábola com vértice em v = 0. Dobrar a velocidade multiplica a energia por quatro. A massa abre ou fecha a parábola.",
    pontoDestaqueX: 4,
  },
  {
    id: "epe_x",
    formulaId: "energia_potencial_elastica",
    nome: "Energia elástica × deformação",
    eixosLabel: "Epe × x",
    expressao: "Epe = ½·k·x²",
    grau: 2,
    area: "energia",
    eixoX: {
      simbolo: "x",
      nome: "Deformação",
      unidade: "m",
      min: -0.5,
      max: 0.5,
      amostras: 100,
    },
    eixoY: { simbolo: "Epe", nome: "Energia potencial elástica", unidade: "J" },
    parametros: [
      {
        id: "k",
        simbolo: "k",
        nome: "Constante elástica",
        unidade: "N/m",
        min: 10,
        max: 200,
        step: 5,
        default: 50,
      },
    ],
    avaliar: (x, p) => 0.5 * p.k * x * x,
    insight:
      "Como Ec, a energia na mola é quadrática na deformação. Em x = 0 a energia é zero; alongar ou comprimir o mesmo |x| guarda a mesma energia — parábola simétrica.",
    pontoDestaqueX: 0.2,
  },
];

export function obterGrafico(id: string): VisualizacaoGrafico | undefined {
  return catalogoGraficos.find((g) => g.id === id);
}

export function obterGraficosPorGrau(grau: GrauEquacao | "todos"): VisualizacaoGrafico[] {
  if (grau === "todos") return catalogoGraficos;
  return catalogoGraficos.filter((g) => g.grau === grau);
}

export function obterGraficosPorArea(area: AreaFisica | "todas"): VisualizacaoGrafico[] {
  if (area === "todas") return catalogoGraficos;
  return catalogoGraficos.filter((g) => g.area === area);
}

export interface PontoGrafico {
  x: number;
  y: number;
}

export interface IntervaloEixo {
  min: number;
  max: number;
}

/** Gera pontos da curva para o intervalo do eixo X (catálogo ou override). */
export function gerarPontosCurva(
  visualizacao: VisualizacaoGrafico,
  params: Record<string, number>,
  intervaloX?: IntervaloEixo
): PontoGrafico[] {
  const { eixoX, avaliar } = visualizacao;
  const xMin = intervaloX?.min ?? eixoX.min;
  const xMax = intervaloX?.max ?? eixoX.max;
  const n = eixoX.amostras ?? 80;
  const pontos: PontoGrafico[] = [];
  const span = xMax - xMin;
  if (span <= 0) return pontos;
  for (let i = 0; i <= n; i++) {
    const x = xMin + (span * i) / n;
    pontos.push({ x, y: avaliar(x, params) });
  }
  return pontos;
}

/** Domínio Y sugerido a partir dos pontos, com margem percentual. */
export function dominioYSugerido(
  pontos: PontoGrafico[],
  margem = 0.12
): IntervaloEixo {
  if (pontos.length === 0) return { min: -1, max: 1 };
  let yMin = Infinity;
  let yMax = -Infinity;
  for (const p of pontos) {
    if (p.y < yMin) yMin = p.y;
    if (p.y > yMax) yMax = p.y;
  }
  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    return { min: -1, max: 1 };
  }
  if (yMin === yMax) {
    const delta = Math.abs(yMin) > 1e-9 ? Math.abs(yMin) * 0.2 : 1;
    return { min: yMin - delta, max: yMax + delta };
  }
  const pad = (yMax - yMin) * margem;
  return { min: yMin - pad, max: yMax + pad };
}

/** Valores padrão dos parâmetros de uma visualização. */
export function parametrosPadrao(
  visualizacao: VisualizacaoGrafico
): Record<string, number> {
  return Object.fromEntries(
    visualizacao.parametros.map((p) => [p.id, p.default])
  );
}
