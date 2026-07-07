import type { AreaFisica } from "../formulas/catalog";

export interface Fenomeno {
  id: string;
  nome: string;
  descricao: string;
  entidades: string[];
  area: AreaFisica;
  variaveis: string[];
  formulas: string[];
}

export const catalogoFenomenos: Fenomeno[] = [
  {
    id: "freada_veiculo",
    nome: "Freada de um veículo",
    descricao:
      "Um carro reduz a velocidade ao frear. A desaceleração conecta a variação de velocidade ao tempo e, pela 2ª lei de Newton, à força de atrito sobre o veículo.",
    entidades: ["carro", "ônibus", "caminhão", "motocicleta"],
    area: "cinematica",
    variaveis: [
      "aceleracao.modulo",
      "velocidade.inicial",
      "velocidade.final",
      "tempo.modulo",
      "forca.resultante",
      "massa.modulo",
      "atritoCinetico.modulo",
    ],
    formulas: [
      "mruv_velocidade_final",
      "torricelli",
      "segunda_lei_newton",
      "atrito_cinetico",
    ],
  },
  {
    id: "arrancada_veiculo",
    nome: "Arrancada de um veículo",
    descricao:
      "Ao sair do repouso, o carro ganha velocidade com aceleração positiva. O motor aplica força resultante e o movimento é descrito pelo MRUV.",
    entidades: ["carro", "ônibus", "trem"],
    area: "cinematica",
    variaveis: [
      "aceleracao.modulo",
      "velocidade.final",
      "velocidade.inicial",
      "tempo.modulo",
      "forca.resultante",
      "massa.modulo",
    ],
    formulas: ["mruv_velocidade_final", "mruv_posicao_final", "segunda_lei_newton"],
  },
  {
    id: "queda_livre",
    nome: "Queda livre",
    descricao:
      "Um corpo em queda sob a gravidade acelera constantemente para baixo. A aceleração é g e o movimento é MRUV na vertical.",
    entidades: ["pedra", "corpo", "objeto", "projétil"],
    area: "cinematica",
    variaveis: [
      "aceleracao.modulo",
      "aceleracaoGravidade.modulo",
      "velocidade.final",
      "velocidade.inicial",
      "posicao.delta",
      "tempo.modulo",
      "peso.modulo",
      "massa.modulo",
    ],
    formulas: [
      "mruv_velocidade_final",
      "mruv_posicao_final",
      "torricelli",
      "forca_peso",
    ],
  },
  {
    id: "curva_circular",
    nome: "Movimento em curva",
    descricao:
      "Em uma curva, a direção da velocidade muda mesmo com módulo constante. Isso exige aceleração centrípeta apontando para o centro da trajetória.",
    entidades: ["carro", "motociclista", "satélite", "roda gigante"],
    area: "cinematica",
    variaveis: [
      "aceleracao.centripeta",
      "velocidade.modulo",
      "raio.modulo",
      "forca.resultante",
    ],
    formulas: ["aceleracao_centripeta", "segunda_lei_newton", "relacao_v_omega"],
  },
  {
    id: "mola_deformada",
    nome: "Mola comprimida ou esticada",
    descricao:
      "Uma mola deformada exerce força restauradora e armazena energia potencial elástica. É o modelo clássico de oscilação no ensino médio.",
    entidades: ["mola", "bloco", "massa"],
    area: "dinamica",
    variaveis: [
      "forcaElastica.modulo",
      "constanteElastica.modulo",
      "deformacao.modulo",
      "energiaPotencialElastica.modulo",
    ],
    formulas: ["forca_elastica", "energia_potencial_elastica"],
  },
  {
    id: "colisao_impulso",
    nome: "Colisão e impulso",
    descricao:
      "Em uma batida ou freada brusca, uma força atua por pouco tempo e altera o momento linear do corpo. O impulso mede essa troca.",
    entidades: ["bola", "carro", "jogador", "corpo"],
    area: "momento",
    variaveis: [
      "impulso.modulo",
      "forca.modulo",
      "tempo.delta",
      "momentoLinear.modulo",
      "massa.modulo",
      "velocidade.modulo",
    ],
    formulas: ["impulso_forca", "teorema_impulso", "momento_linear"],
  },
  {
    id: "elevacao_objeto",
    nome: "Elevação de um objeto",
    descricao:
      "Ao levantar um corpo, trabalho é realizado contra a gravidade e energia potencial gravitacional é armazenada proporcionalmente à altura.",
    entidades: ["caixa", "livro", "peso", "elevador"],
    area: "energia",
    variaveis: [
      "energiaPotencialGravitacional.modulo",
      "massa.modulo",
      "aceleracaoGravidade.modulo",
      "altura.modulo",
      "trabalho.modulo",
      "forca.modulo",
    ],
    formulas: [
      "energia_potencial_gravitacional",
      "trabalho_forca_constante",
      "forca_peso",
    ],
  },
  {
    id: "orbita_planetaria",
    nome: "Órbita e gravitação universal",
    descricao:
      "Planetas e satélites se atraem pela gravitação universal. A força depende das massas e da distância entre os corpos.",
    entidades: ["planeta", "satélite", "lua", "terra", "estrela"],
    area: "gravitacao",
    variaveis: [
      "forcaGravitacional.modulo",
      "massaCorpo1.modulo",
      "massaCorpo2.modulo",
      "distancia.modulo",
      "constanteGravitacional.modulo",
    ],
    formulas: ["forca_gravitacional"],
  },
  {
    id: "roda_girando",
    nome: "Rotação de um disco ou roda",
    descricao:
      "Corpos que giram têm velocidade angular, momento de inércia e podem sofrer torque. A dinâmica rotacional espelha a linear com grandezas angulares.",
    entidades: ["roda", "disco", "polia", "motor"],
    area: "rotacao",
    variaveis: [
      "velocidadeAngular.modulo",
      "aceleracaoAngular.modulo",
      "torque.modulo",
      "momentoInercia.modulo",
      "momentoAngular.modulo",
    ],
    formulas: [
      "mcu_velocidade_angular_final",
      "segunda_lei_rotacao",
      "momento_angular",
      "relacao_v_omega",
    ],
  },
  {
    id: "deslizamento_atrito",
    nome: "Deslizamento com atrito",
    descricao:
      "Quando duas superfícies deslizam, o atrito cinético se opõe ao movimento e dissipa energia. Antes de deslizar, o atrito estático impede o movimento.",
    entidades: ["caixa", "bloco", "carro", "piso"],
    area: "dinamica",
    variaveis: [
      "atritoCinetico.modulo",
      "atritoEstatico.modulo",
      "coeficienteAtrito.cinetico",
      "coeficienteAtrito.estatico",
      "forcaNormal.modulo",
      "forca.resultante",
    ],
    formulas: ["atrito_cinetico", "atrito_estatico_maximo", "segunda_lei_newton"],
  },
];

export function buscarFenomenoPorId(id: string): Fenomeno | undefined {
  return catalogoFenomenos.find((f) => f.id === id);
}
