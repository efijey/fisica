import type { AreaFisica } from "@fisica/physics-core";

export type Veredito = "certo" | "no_caminho" | "desviado";

export interface RubricaProblema {
  /** Frases a buscar; use `|` para sinônimos da mesma ideia. */
  conceitosObrigatorios: string[];
  /** Sinônimos extras que contam se faltar um obrigatório. */
  conceitosAlternativos?: string[];
  /** Equívocos comuns que puxam o veredito para desviado. */
  conceitosProibidos?: string[];
  /** Quantidade mínima de obrigatórios para "no_caminho". */
  minObrigatorios: number;
}

export interface ProblemaConceitual {
  id: string;
  titulo: string;
  contexto: string;
  pergunta: string;
  area: Extract<AreaFisica, "cinematica" | "dinamica">;
  formulas: string[];
  variaveis: string[];
  fenomenos: string[];
  rubrica: RubricaProblema;
  dica: string;
}

export const catalogoProblemas: ProblemaConceitual[] = [
  {
    id: "vm_onibus_escolar",
    titulo: "Velocidade média do ônibus",
    contexto:
      "Um ônibus escolar percorre 12 km entre o bairro e a escola. O trajeto completo leva 20 minutos, com algumas paradas no caminho. A motorista quer saber a velocidade média do percurso, não a velocidade em cada instante.",
    pergunta:
      "Explique, em palavras, como você descobriria a velocidade média desse ônibus. Quais grandezas usaria e como elas se relacionam?",
    area: "cinematica",
    formulas: ["velocidade_media"],
    variaveis: ["velocidade.media", "posicao.delta", "tempo.delta"],
    fenomenos: [],
    rubrica: {
      conceitosObrigatorios: [
        "velocidade media|velocidade média|vm",
        "deslocamento|distancia|distância|delta s|Δs|espaco|espaço",
        "tempo|intervalo|delta t|Δt",
      ],
      conceitosAlternativos: ["dividir|razao|razão|dividindo"],
      minObrigatorios: 2,
      conceitosProibidos: ["aceleracao|aceleração|forca|força|massa"],
    },
    dica: "Velocidade média é a razão entre o deslocamento (ou distância percorrida no problema) e o intervalo de tempo — Vm = ΔS / Δt.",
  },
  {
    id: "freada_aceleracao",
    titulo: "Freada: achar a aceleração",
    contexto:
      "Um carro vem a 72 km/h e o motorista freia até parar em 4 segundos. Você quer entender a intensidade dessa freada, ou seja, a aceleração (desaceleração) do carro.",
    pergunta:
      "Como você descobriria a aceleração nesse freio? Descreva o raciocínio e quais dados usaria — sem precisar calcular o número.",
    area: "cinematica",
    formulas: ["mruv_velocidade_final"],
    variaveis: [
      "aceleracao.modulo",
      "velocidade.inicial",
      "velocidade.final",
      "tempo.modulo",
    ],
    fenomenos: ["freada_veiculo"],
    rubrica: {
      conceitosObrigatorios: [
        "aceleracao|aceleração|desaceleracao|desaceleração",
        "velocidade|velocidade inicial|velocidade final|v0|v₀",
        "tempo|segundos|intervalo",
      ],
      conceitosAlternativos: [
        "variacao de velocidade|variação de velocidade|mudanca de velocidade|mudança de velocidade",
        "a =|a=(v|mruv",
      ],
      minObrigatorios: 2,
      conceitosProibidos: [],
    },
    dica: "No MRUV, a aceleração liga a mudança de velocidade ao tempo: a = (v − v₀) / t. Aqui v final é zero.",
  },
  {
    id: "arrancada_mruv",
    titulo: "Arrancada do semáforo",
    contexto:
      "Um carro parado no semáforo arranca e, depois de alguns segundos, já está a 54 km/h. O movimento não é uniforme: a velocidade está aumentando.",
    pergunta:
      "Que tipo de movimento é esse e como você relacionaria velocidade, aceleração e tempo para descrever a arrancada?",
    area: "cinematica",
    formulas: ["mruv_velocidade_final", "mruv_posicao_final"],
    variaveis: [
      "aceleracao.modulo",
      "velocidade.final",
      "velocidade.inicial",
      "tempo.modulo",
    ],
    fenomenos: ["arrancada_veiculo"],
    rubrica: {
      conceitosObrigatorios: [
        "aceleracao|aceleração|mruv|uniformemente variado",
        "velocidade|velocidade final|v =",
        "tempo",
      ],
      conceitosAlternativos: [
        "partindo do repouso|partida do repouso|v0 = 0|v₀ = 0|parado",
        "v = v0|v = v₀",
      ],
      minObrigatorios: 2,
      conceitosProibidos: ["velocidade constante"],
    },
    dica: "É MRUV: a velocidade muda com o tempo. Partindo do repouso, v = a·t (ou v = v₀ + a·t com v₀ = 0).",
  },
  {
    id: "queda_livre_g",
    titulo: "Pedra em queda livre",
    contexto:
      "Uma pedra é solta do alto de um prédio, sem velocidade inicial. Desprezando a resistência do ar, ela cai sob ação da gravidade.",
    pergunta:
      "Qual é a aceleração desse movimento e como você usaria isso para pensar na velocidade da pedra ao longo da queda?",
    area: "cinematica",
    formulas: ["mruv_velocidade_final", "forca_peso"],
    variaveis: [
      "aceleracao.modulo",
      "aceleracaoGravidade.modulo",
      "velocidade.final",
      "velocidade.inicial",
    ],
    fenomenos: ["queda_livre"],
    rubrica: {
      conceitosObrigatorios: [
        "gravidade|g |aceleracao da gravidade|aceleração da gravidade|9,8|9.8",
        "aceleracao|aceleração|queda livre|mruv",
        "velocidade|aumenta|cresce",
      ],
      conceitosAlternativos: ["v = g|v = gt|peso"],
      minObrigatorios: 2,
      conceitosProibidos: ["velocidade constante"],
    },
    dica: "Na queda livre (sem ar), a aceleração é g ≈ 9,8 m/s². A velocidade cresce como no MRUV: v = v₀ + g·t.",
  },
  {
    id: "torricelli_sem_tempo",
    titulo: "Freada sem cronômetro",
    contexto:
      "Um ciclista freia de 10 m/s até parar em uma distância de 8 m. Você não sabe quanto tempo durou a freada — só a velocidade inicial, a final e o deslocamento.",
    pergunta:
      "Como descobrir a aceleração sem conhecer o tempo? Que relação entre grandezas você usaria?",
    area: "cinematica",
    formulas: ["torricelli"],
    variaveis: [
      "velocidade.final",
      "velocidade.inicial",
      "aceleracao.modulo",
      "posicao.delta",
    ],
    fenomenos: ["freada_veiculo"],
    rubrica: {
      conceitosObrigatorios: [
        "torricelli|v2|v²|sem o tempo|sem tempo|nao precisa do tempo|não precisa do tempo",
        "aceleracao|aceleração",
        "deslocamento|distancia|distância|delta s|Δs|espaco|espaço",
      ],
      conceitosAlternativos: [
        "velocidade inicial|velocidade final",
        "v2 = v0|v² = v₀",
      ],
      minObrigatorios: 2,
      conceitosProibidos: [],
    },
    dica: "Torricelli relaciona velocidades, aceleração e deslocamento sem o tempo: v² = v₀² + 2·a·ΔS.",
  },
  {
    id: "newton_caixa_empurrada",
    titulo: "Caixa empurrada: achar a aceleração",
    contexto:
      "Uma caixa de massa conhecida está sobre um chão liso (atrito desprezível). Uma pessoa aplica uma força horizontal constante sobre a caixa.",
    pergunta:
      "Como você descobriria a aceleração da caixa? Quais conceitos da dinâmica entram nessa explicação?",
    area: "dinamica",
    formulas: ["segunda_lei_newton"],
    variaveis: ["forca.resultante", "massa.modulo", "aceleracao.modulo"],
    fenomenos: [],
    rubrica: {
      conceitosObrigatorios: [
        "forca|força|forca resultante|força resultante",
        "massa",
        "aceleracao|aceleração",
      ],
      conceitosAlternativos: [
        "segunda lei|2a lei|2ª lei|newton|f = m|f=m|a = f",
      ],
      minObrigatorios: 2,
      conceitosProibidos: [],
    },
    dica: "Pela 2ª lei de Newton, F = m·a, então a = F / m. A força resultante e a massa determinam a aceleração.",
  },
  {
    id: "newton_forca_resultante",
    titulo: "Qual força acelera o carrinho?",
    contexto:
      "Um carrinho de massa 2 kg ganha velocidade com aceleração de 3 m/s² em linha reta sobre uma mesa sem atrito. Você quer saber a intensidade da força resultante que age sobre ele.",
    pergunta:
      "Explique como achar essa força resultante usando os conceitos certos — sem precisar fechar a conta.",
    area: "dinamica",
    formulas: ["segunda_lei_newton"],
    variaveis: ["forca.resultante", "massa.modulo", "aceleracao.modulo"],
    fenomenos: ["arrancada_veiculo"],
    rubrica: {
      conceitosObrigatorios: [
        "forca|força|forca resultante|força resultante",
        "massa",
        "aceleracao|aceleração",
      ],
      conceitosAlternativos: ["f = m|f=ma|segunda lei|newton|produto"],
      minObrigatorios: 2,
      conceitosProibidos: [],
    },
    dica: "A força resultante é o produto da massa pela aceleração: F = m·a.",
  },
  {
    id: "mru_ou_mruv",
    titulo: "Trem: uniforme ou variado?",
    contexto:
      "Dois trens saem da estação. O trem A mantém sempre a mesma velocidade nos trilhos retos. O trem B aumenta a velocidade de forma constante depois da partida.",
    pergunta:
      "Como você distinguiria o movimento do trem A do movimento do trem B? Que grandezas mudam (ou não) em cada caso?",
    area: "cinematica",
    formulas: ["mru_posicao_final", "mruv_velocidade_final"],
    variaveis: [
      "velocidade.modulo",
      "aceleracao.modulo",
      "posicao.final",
      "tempo.modulo",
    ],
    fenomenos: [],
    rubrica: {
      conceitosObrigatorios: [
        "mru|velocidade constante|uniforme",
        "mruv|aceleracao|aceleração|variado|velocidade muda|velocidade aumenta",
      ],
      conceitosAlternativos: [
        "aceleracao zero|aceleração zero|a = 0",
        "posicao|s = s0",
      ],
      minObrigatorios: 2,
      conceitosProibidos: [],
    },
    dica: "Trem A: MRU (aceleração nula, velocidade constante). Trem B: MRUV (aceleração constante, velocidade muda com o tempo).",
  },
];

export function buscarProblemaPorId(id: string): ProblemaConceitual | undefined {
  return catalogoProblemas.find((p) => p.id === id);
}
