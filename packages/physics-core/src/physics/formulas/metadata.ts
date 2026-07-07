export interface MetadadosFormula {
  porqueUsar: string;
  relacaoGrandezas: string;
  cenariosTipicos: string[];
  fenomenos: string[];
}

export const metadadosFormulas: Record<string, MetadadosFormula> = {
  velocidade_media: {
    porqueUsar:
      "Quando você conhece o deslocamento total e o tempo total, mas o movimento não precisa ser uniforme.",
    relacaoGrandezas:
      "O deslocamento e o tempo estão diretamente proporcionais: dobrar o deslocamento com mesmo tempo dobra a velocidade média.",
    cenariosTipicos: [
      "Viagem de carro com ida e volta",
      "Tempo de percurso entre duas cidades",
    ],
    fenomenos: [],
  },
  mru_posicao_final: {
    porqueUsar:
      "Quando o movimento é uniforme (velocidade constante) e você precisa da posição em um instante.",
    relacaoGrandezas:
      "A posição cresce linearmente com o tempo: cada segundo, o corpo avança a mesma quantidade (v).",
    cenariosTipicos: ["Carro em velocidade constante na estrada", "Esteira rolante"],
    fenomenos: [],
  },
  mruv_velocidade_final: {
    porqueUsar:
      "Quando a aceleração é constante e você quer a velocidade após um intervalo de tempo.",
    relacaoGrandezas:
      "A velocidade muda linearmente com o tempo: a aceleração é a 'inclinação' dessa variação.",
    cenariosTipicos: [
      "Carro acelerando ou freando com aceleração constante",
      "Queda livre (com v₀ = 0 no instante inicial)",
    ],
    fenomenos: ["freada_veiculo", "arrancada_veiculo", "queda_livre"],
  },
  mruv_posicao_final: {
    porqueUsar:
      "Quando a aceleração é constante e você precisa da posição (não só da velocidade) em um instante.",
    relacaoGrandezas:
      "A posição depende do tempo ao quadrado (t²) por causa da aceleração — o termo ½·a·t² captura essa curvatura.",
    cenariosTipicos: [
      "Distância percorrida durante uma freada",
      "Altura em lançamento vertical",
    ],
    fenomenos: ["freada_veiculo", "arrancada_veiculo", "queda_livre"],
  },
  torricelli: {
    porqueUsar:
      "Quando o tempo não é dado nem pedido, mas você tem velocidades, aceleração e deslocamento.",
    relacaoGrandezas:
      "Relaciona energia cinética (v²) com trabalho da aceleração (a·ΔS) sem envolver tempo — útil quando t é desconhecido.",
    cenariosTipicos: [
      "Velocidade ao final de uma rampa",
      "Velocidade antes de uma colisão após percorrer distância",
    ],
    fenomenos: ["freada_veiculo", "queda_livre"],
  },
  aceleracao_centripeta: {
    porqueUsar:
      "Quando o corpo descreve trajetória curva — mesmo com velocidade constante, há aceleração para o centro.",
    relacaoGrandezas:
      "Quanto maior a velocidade ou menor o raio, maior a aceleração centrípeta necessária (ac ∝ v²/r).",
    cenariosTipicos: [
      "Carro em curva",
      "Satélite em órbita circular",
      "Globo da morte",
    ],
    fenomenos: ["curva_circular"],
  },
  velocidade_angular_media: {
    porqueUsar: "Quando o movimento é de rotação e você conhece o ângulo girado e o tempo.",
    relacaoGrandezas:
      "Analogia direta da velocidade média linear: deslocamento angular dividido pelo tempo.",
    cenariosTipicos: ["Volta completa de uma roda", "Rotação de um motor"],
    fenomenos: ["roda_girando"],
  },
  relacao_v_omega: {
    porqueUsar:
      "Para converter entre movimento linear na borda e rotação do corpo (pneu, roda, planeta).",
    relacaoGrandezas:
      "A velocidade linear na borda é o produto da velocidade angular pelo raio: v = ω·r.",
    cenariosTipicos: ["Velocidade de um ponto na borda de um disco", "Pneu de carro"],
    fenomenos: ["curva_circular", "roda_girando"],
  },
  mcu_velocidade_angular_final: {
    porqueUsar:
      "Quando a aceleração angular é constante e você quer a velocidade angular após um tempo.",
    relacaoGrandezas:
      "Versão angular do MRUV: a velocidade angular muda linearmente com o tempo.",
    cenariosTipicos: ["Motor acelerando uma roda", "Disco sendo freado"],
    fenomenos: ["roda_girando"],
  },
  segunda_lei_newton: {
    porqueUsar:
      "Para conectar força e movimento — é a ponte entre dinâmica (forças) e cinemática (aceleração).",
    relacaoGrandezas:
      "A aceleração é proporcional à força resultante e inversamente proporcional à massa: a = F/m.",
    cenariosTipicos: [
      "Carro acelerado pelo motor",
      "Caixa sendo empurrada",
      "Corpo em queda (F = P)",
    ],
    fenomenos: [
      "freada_veiculo",
      "arrancada_veiculo",
      "queda_livre",
      "curva_circular",
      "deslizamento_atrito",
    ],
  },
  forca_peso: {
    porqueUsar:
      "Para calcular a força gravitacional da Terra sobre um corpo próximo à superfície.",
    relacaoGrandezas:
      "O peso é proporcional à massa: corpos mais pesados (maior massa) sofrem maior força gravitacional.",
    cenariosTipicos: ["Peso em uma balança", "Força no elevador", "Queda livre"],
    fenomenos: ["queda_livre", "elevacao_objeto"],
  },
  forca_elastica: {
    porqueUsar: "Quando há mola, elástico ou qualquer deformação elástica no problema.",
    relacaoGrandezas:
      "Quanto maior a deformação, maior a força restauradora — a mola 'empurra de volta' proporcionalmente.",
    cenariosTipicos: ["Bloco em mola", "Dinamômetro", "Amortecedor de carro"],
    fenomenos: ["mola_deformada"],
  },
  atrito_cinetico: {
    porqueUsar: "Quando o enunciado diz que o corpo desliza ou há movimento relativo entre superfícies.",
    relacaoGrandezas:
      "O atrito cinético depende do coeficiente μc e da força normal — quanto maior a pressão, maior o atrito.",
    cenariosTipicos: ["Caixa deslizando no chão", "Carro derrapando", "Freio travado"],
    fenomenos: ["freada_veiculo", "deslizamento_atrito"],
  },
  atrito_estatico_maximo: {
    porqueUsar:
      "Para saber a força máxima de atrito antes do corpo começar a deslizar.",
    relacaoGrandezas:
      "Semelhante ao atrito cinético, mas com coeficiente estático μe — geralmente maior que μc.",
    cenariosTipicos: [
      "Caixa parada em caminhão acelerando",
      "Carro parado em rampa",
    ],
    fenomenos: ["deslizamento_atrito"],
  },
  energia_cinetica: {
    porqueUsar:
      "Para quantificar a energia do movimento — essencial em problemas de conservação de energia.",
    relacaoGrandezas:
      "Depende do quadrado da velocidade: dobrar a velocidade quadruplica a energia cinética.",
    cenariosTipicos: ["Velocidade de um carro", "Bola em movimento", "Colisões"],
    fenomenos: ["colisao_impulso"],
  },
  energia_potencial_gravitacional: {
    porqueUsar:
      "Quando o corpo está acima de um nível de referência em um campo gravitacional.",
    relacaoGrandezas:
      "Energia armazenada cresce linearmente com altura e massa — subir um objeto 'acumula' energia.",
    cenariosTipicos: ["Objeto em prateleira", "Água em represa", "Elevador parado"],
    fenomenos: ["elevacao_objeto", "queda_livre"],
  },
  energia_potencial_elastica: {
    porqueUsar: "Quando uma mola está comprimida ou esticada e armazena energia.",
    relacaoGrandezas:
      "Depende do quadrado da deformação — comprimir duas vezes mais quadruplica a energia armazenada.",
    cenariosTipicos: ["Arco e flecha", "Mola comprimida", "Trampolim"],
    fenomenos: ["mola_deformada"],
  },
  trabalho_forca_constante: {
    porqueUsar:
      "Quando uma força constante atua paralelamente ao deslocamento e você quer a energia transferida.",
    relacaoGrandezas:
      "Trabalho é força vezes deslocamento — sem deslocamento, não há trabalho (mesmo com força).",
    cenariosTipicos: ["Empurrar caixa no chão", "Elevador subindo", "Compressor de mola"],
    fenomenos: ["elevacao_objeto"],
  },
  potencia_trabalho: {
    porqueUsar: "Quando o problema envolve quanto trabalho é feito por unidade de tempo.",
    relacaoGrandezas:
      "Potência é trabalho dividido pelo tempo — fazer o mesmo trabalho em menos tempo exige mais potência.",
    cenariosTipicos: ["Motor de carro", "Elevador rápido vs lento"],
    fenomenos: [],
  },
  potencia_forca_velocidade: {
    porqueUsar:
      "Para potência instantânea quando se conhece força e velocidade no mesmo instante.",
    relacaoGrandezas:
      "P = F·v — se a força e a velocidade têm mesma direção, a potência é máxima.",
    cenariosTipicos: ["Carro em velocidade constante com motor ligado", "Esteira"],
    fenomenos: ["arrancada_veiculo"],
  },
  momento_linear: {
    porqueUsar:
      "Para descrever o 'ímpeto' de um corpo em movimento — fundamental em colisões.",
    relacaoGrandezas:
      "Momento é massa vezes velocidade — caminhão lento pode ter mesmo momento que carro rápido.",
    cenariosTipicos: ["Colisão entre veículos", "Bola de bilhar", "Jogador em sprint"],
    fenomenos: ["colisao_impulso"],
  },
  impulso_forca: {
    porqueUsar:
      "Quando uma força atua por um intervalo de tempo e você quer medir o efeito sobre o movimento.",
    relacaoGrandezas:
      "Impulso é força vezes tempo — a mesma força por mais tempo gera maior impulso.",
    cenariosTipicos: ["Batida de taco", "Airbag", "Chute em bola"],
    fenomenos: ["colisao_impulso"],
  },
  teorema_impulso: {
    porqueUsar:
      "Para relacionar impulso à mudança de momento — essencial em colisões e impactos.",
    relacaoGrandezas:
      "O impulso recebido é igual à variação do momento: J = Δp.",
    cenariosTipicos: ["Colisão de bolas", "Freada brusca", "Rebatida"],
    fenomenos: ["colisao_impulso"],
  },
  torque_forca: {
    porqueUsar:
      "Quando uma força tende a girar um corpo em torno de um eixo (alavanca, porta, chave).",
    relacaoGrandezas:
      "Torque cresce com a força e com o braço de alavanca (distância ao eixo).",
    cenariosTipicos: ["Chave de boca", "Porta empurrada na maçaneta", "Polia"],
    fenomenos: ["roda_girando"],
  },
  segunda_lei_rotacao: {
    porqueUsar:
      "Versão rotacional da 2ª lei de Newton — conecta torque e aceleração angular.",
    relacaoGrandezas:
      "A aceleração angular é proporcional ao torque e inversamente proporcional ao momento de inércia.",
    cenariosTipicos: ["Motor girando roda", "Disco sendo acelerado"],
    fenomenos: ["roda_girando"],
  },
  momento_angular: {
    porqueUsar:
      "Para descrever a quantidade de movimento em rotação — análogo ao momento linear.",
    relacaoGrandezas:
      "Momento angular é momento de inércia vezes velocidade angular: L = I·ω.",
    cenariosTipicos: ["Patinador girando", "Giroscópio", "Planeta em rotação"],
    fenomenos: ["roda_girando"],
  },
  forca_gravitacional: {
    porqueUsar:
      "Para força de atração entre dois corpos celestes ou massas muito separadas.",
    relacaoGrandezas:
      "A força cresce com o produto das massas e decai com o quadrado da distância (1/r²).",
    cenariosTipicos: [
      "Terra e Lua",
      "Sol e planeta",
      "Dois corpos esféricos distantes",
    ],
    fenomenos: ["orbita_planetaria"],
  },
};

export function obterMetadadosFormula(id: string): MetadadosFormula | undefined {
  return metadadosFormulas[id];
}
