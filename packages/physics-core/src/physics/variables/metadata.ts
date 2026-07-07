export interface MetadadosVariavel {
  significado: string;
  exemplosNatureza: string[];
  quandoRelevante: string;
}

export const metadadosVariaveis: Record<string, MetadadosVariavel> = {
  "aceleracao.modulo": {
    significado:
      "Taxa de variação da velocidade no tempo. Mede o quanto a velocidade muda por segundo — positiva ao acelerar, negativa ao frear.",
    exemplosNatureza: [
      "Carro freando no semáforo",
      "Corpo em queda livre (a ≈ g)",
      "Arrancada de um ônibus",
      "Piloto reduzindo velocidade antes de uma curva",
    ],
    quandoRelevante:
      "Sempre que o movimento não é uniforme: partidas, freadas, quedas, colisões ou qualquer situação em que a velocidade muda.",
  },
  "aceleracao.centripeta": {
    significado:
      "Componente da aceleração que aponta para o centro da trajetória curva, responsável pela mudança de direção da velocidade.",
    exemplosNatureza: [
      "Carro em curva na estrada",
      "Satélite em órbita",
      "Globo da morte em circo",
    ],
    quandoRelevante:
      "Quando o enunciado menciona curva, trajetória circular ou mudança de direção com velocidade constante.",
  },
  "aceleracaoAngular.modulo": {
    significado:
      "Taxa de variação da velocidade angular. É a versão rotacional da aceleração linear.",
    exemplosNatureza: [
      "Motor acelerando uma roda",
      "Disco de vinil ganhando rotação",
      "Polia sendo freada",
    ],
    quandoRelevante:
      "Problemas de rotação em que a velocidade angular não é constante (MCUV).",
  },
  "aceleracaoGravidade.modulo": {
    significado:
      "Aceleração que a gravidade imprime a corpos próximos à superfície terrestre, aproximadamente 9,8 m/s².",
    exemplosNatureza: [
      "Queda de objetos",
      "Peso de um corpo na Terra",
      "Lançamentos verticais",
    ],
    quandoRelevante:
      "Quando o problema envolve gravidade terrestre, peso ou queda livre próxima à superfície.",
  },
  "velocidade.modulo": {
    significado:
      "Rapidez com que um corpo se desloca, medida em m/s. Indica o quanto a posição muda por unidade de tempo.",
    exemplosNatureza: [
      "Velocímetro de um carro",
      "Velocidade de um corredor",
      "Velocidade de um projétil",
    ],
    quandoRelevante:
      "Quase todo problema de cinemática e dinâmica envolve velocidade — é a grandeza que descreve o 'quão rápido' algo se move.",
  },
  "velocidade.inicial": {
    significado: "Velocidade do corpo no instante inicial do intervalo analisado.",
    exemplosNatureza: [
      "Velocidade ao sair do repouso (v₀ = 0)",
      "Velocidade antes de frear",
      "Velocidade ao ser lançado",
    ],
    quandoRelevante: "Problemas de MRUV, lançamentos ou qualquer movimento com variação de velocidade no tempo.",
  },
  "velocidade.final": {
    significado: "Velocidade do corpo no instante final do intervalo analisado.",
    exemplosNatureza: [
      "Velocidade ao atingir o semáforo",
      "Velocidade ao tocar o solo na queda",
      "Velocidade máxima de um carro",
    ],
    quandoRelevante: "Quando o enunciado pede ou fornece a velocidade em um instante específico após o movimento.",
  },
  "velocidade.media": {
    significado:
      "Razão entre o deslocamento total e o tempo total. Não é a média aritmética das velocidades instantâneas.",
    exemplosNatureza: [
      "Média de uma viagem de carro (ida e volta)",
      "Tempo de percurso em maratonas",
    ],
    quandoRelevante:
      "Quando o problema fornece deslocamento e tempo total, sem detalhar a variação de velocidade.",
  },
  "velocidadeAngular.modulo": {
    significado:
      "Rapidez com que um corpo gira em torno de um eixo, medida em rad/s.",
    exemplosNatureza: [
      "Rotação de uma roda",
      "Planeta girando sobre o eixo",
      "Hélice de ventilador",
    ],
    quandoRelevante: "Problemas de movimento circular ou rotação de corpos rígidos.",
  },
  "velocidadeAngular.inicial": {
    significado: "Velocidade angular no instante inicial.",
    exemplosNatureza: ["Motor partindo do repouso", "Disco já girando antes de ser freado"],
    quandoRelevante: "MCUV e problemas de rotação com variação de velocidade angular.",
  },
  "velocidadeAngular.final": {
    significado: "Velocidade angular no instante final.",
    exemplosNatureza: ["Roda atingindo rotação máxima", "Polia após desacelerar"],
    quandoRelevante: "MCUV e problemas de rotação com variação de velocidade angular.",
  },
  "massa.modulo": {
    significado:
      "Medida da inércia de um corpo — o quanto ele resiste a mudanças de movimento. Diferente de peso.",
    exemplosNatureza: [
      "Massa de um carro",
      "Massa de um atleta",
      "Massa de um planeta (em gravitação)",
    ],
    quandoRelevante:
      "Aparece na 2ª lei de Newton, energia cinética, momento linear e praticamente toda dinâmica.",
  },
  "forca.modulo": {
    significado:
      "Interação capaz de alterar o estado de movimento ou deformar um corpo, medida em newtons (N).",
    exemplosNatureza: [
      "Empurrão em uma caixa",
      "Tração em uma corda",
      "Força do motor de um carro",
    ],
    quandoRelevante:
      "Quando há empurrão, tração, impacto ou qualquer interação mecânica explícita.",
  },
  "forca.resultante": {
    significado:
      "Soma vetorial de todas as forças que atuam sobre o corpo. É ela que determina a aceleração pela 2ª lei de Newton.",
    exemplosNatureza: [
      "Motor menos atrito em um carro",
      "Peso menos normal em um plano inclinado",
      "Força centrípeta em uma curva",
    ],
    quandoRelevante:
      "Sempre que se aplica F = m·a — o estudante precisa identificar qual força (ou soma) governa o movimento.",
  },
  "peso.modulo": {
    significado:
      "Força gravitacional que a Terra exerce sobre um corpo (P = m·g). É uma força, não uma massa.",
    exemplosNatureza: [
      "Peso de uma pessoa na balança",
      "Força sobre um elevador",
      "Peso de um objeto em queda",
    ],
    quandoRelevante: "Problemas com gravidade, balanças, elevadores ou força vertical sobre corpos.",
  },
  "forcaNormal.modulo": {
    significado:
      "Força de contato perpendicular à superfície, que impede a penetração do corpo no suporte.",
    exemplosNatureza: [
      "Piso sustentando uma caixa",
      "Assento de carro sustentando passageiro",
      "Superfície de uma rampa",
    ],
    quandoRelevante: "Problemas com atrito, planos inclinados ou contato com superfícies.",
  },
  "tempo.modulo": {
    significado: "Duração de um intervalo ou instante em que o fenômeno ocorre.",
    exemplosNatureza: [
      "Tempo de freada de um carro",
      "Tempo de queda de um objeto",
      "Duração de uma viagem",
    ],
    quandoRelevante: "Equações horárias do MRU, MRUV e qualquer análise temporal do movimento.",
  },
  "tempo.delta": {
    significado: "Intervalo de tempo entre dois instantes (Δt = t_final − t_inicial).",
    exemplosNatureza: [
      "Tempo entre largada e chegada",
      "Duração de uma freada",
      "Intervalo de uma colisão",
    ],
    quandoRelevante: "Velocidade média, impulso e qualquer grandeza definida por taxa de variação no tempo.",
  },
  "posicao.final": {
    significado: "Posição do corpo no instante final considerado.",
    exemplosNatureza: ["Posição ao chegar ao destino", "Altura máxima de um lançamento"],
    quandoRelevante: "Equações horárias de posição no MRU e MRUV.",
  },
  "posicao.inicial": {
    significado: "Posição do corpo no instante inicial (origem ou ponto de partida).",
    exemplosNatureza: ["Ponto de largada", "Posição antes de frear", "Base de um prédio"],
    quandoRelevante: "Equações horárias de posição no MRU e MRUV.",
  },
  "posicao.delta": {
    significado:
      "Deslocamento — variação de posição entre dois pontos. Diferente de distância percorrida quando há volta.",
    exemplosNatureza: [
      "Distância em linha reta entre dois pontos",
      "Deslocamento de um elevador entre andares",
    ],
    quandoRelevante: "Velocidade média, Torricelli e trabalho de força constante.",
  },
  "posicaoAngular.delta": {
    significado: "Variação angular — quanto o corpo girou em radianos.",
    exemplosNatureza: ["Volta completa de uma roda (2π rad)", "Giro de um motor"],
    quandoRelevante: "Velocidade angular média e movimento circular.",
  },
  "raio.modulo": {
    significado: "Distância do centro da trajetória circular ao corpo em movimento.",
    exemplosNatureza: [
      "Raio de curva de estrada",
      "Raio de órbita de satélite",
      "Raio de uma roda",
    ],
    quandoRelevante: "Movimento circular, aceleração centrípeta e relação v = ω·r.",
  },
  "forcaElastica.modulo": {
    significado: "Força restauradora exercida por uma mola deformada (Lei de Hooke).",
    exemplosNatureza: ["Mola de suspensão", "Elástico esticado", "Amortecedor"],
    quandoRelevante: "Problemas com molas, elásticos ou energia potencial elástica.",
  },
  "constanteElastica.modulo": {
    significado: "Rigidez da mola — quanto maior k, mais difícil deformá-la.",
    exemplosNatureza: ["Mola de carro", "Mola de caneta", "Balança de mola"],
    quandoRelevante: "Lei de Hooke e energia potencial elástica.",
  },
  "deformacao.modulo": {
    significado: "Quanto a mola foi comprimida ou esticada em relação à posição natural.",
    exemplosNatureza: ["Mola comprimida por um bloco", "Amortecedor afundado"],
    quandoRelevante: "Lei de Hooke e energia potencial elástica.",
  },
  "atritoCinetico.modulo": {
    significado: "Força de atrito quando há deslizamento entre superfícies.",
    exemplosNatureza: ["Carro derrapando", "Caixa sendo arrastada", "Freio ABS acionado"],
    quandoRelevante: "Movimento com superfícies deslizando uma sobre a outra.",
  },
  "atritoEstatico.modulo": {
    significado: "Força de atrito máxima antes do corpo começar a deslizar.",
    exemplosNatureza: [
      "Caixa parada em caminhão acelerando",
      "Carro parado em rampa",
    ],
    quandoRelevante: "Problemas que perguntam se o corpo vai se mover ou qual força mínima para iniciar movimento.",
  },
  "coeficienteAtrito.cinetico": {
    significado: "Adimensional que mede o atrito durante o deslizamento entre duas superfícies.",
    exemplosNatureza: ["Pneu no asfalto molhado vs seco", "Gelo vs borracha"],
    quandoRelevante: "Cálculo de força de atrito cinético (fc = μc·N).",
  },
  "coeficienteAtrito.estatico": {
    significado: "Adimensional que mede o atrito máximo antes do deslizamento começar.",
    exemplosNatureza: ["Pneu parado no asfalto", "Bloco em plano inclinado parado"],
    quandoRelevante: "Cálculo de força de atrito estático máximo (fe = μe·N).",
  },
  "energiaCinetica.modulo": {
    significado: "Energia associada ao movimento — depende da massa e do quadrado da velocidade.",
    exemplosNatureza: [
      "Carro em alta velocidade",
      "Bola em movimento",
      "Corredor em sprint",
    ],
    quandoRelevante: "Problemas de energia, colisões e transformações entre movimento e energia.",
  },
  "energiaPotencialGravitacional.modulo": {
    significado: "Energia armazenada pela posição de um corpo em um campo gravitacional.",
    exemplosNatureza: [
      "Água em represa",
      "Objeto em prateleira alta",
      "Satélite em órbita",
    ],
    quandoRelevante: "Problemas com altura, gravidade e conservação de energia.",
  },
  "energiaPotencialElastica.modulo": {
    significado: "Energia armazenada em uma mola deformada.",
    exemplosNatureza: ["Arco e flecha tensionado", "Mola comprimida", "Trampolim"],
    quandoRelevante: "Oscilações, molas e problemas de energia mecânica com elasticidade.",
  },
  "trabalho.modulo": {
    significado:
      "Energia transferida por uma força ao longo de um deslocamento. Mede o quanto a força 'empurrou' o corpo.",
    exemplosNatureza: [
      "Empurrar um carro com o motor desligado",
      "Elevador subindo com passageiros",
      "Compressor comprimindo mola",
    ],
    quandoRelevante: "Problemas que ligam força, deslocamento e transformação de energia.",
  },
  "potencia.modulo": {
    significado: "Taxa de realização de trabalho — quanto trabalho por unidade de tempo.",
    exemplosNatureza: [
      "Potência de um motor de carro",
      "Potência de uma lâmpada (analogia energética)",
      "Potência de um elevador",
    ],
    quandoRelevante: "Problemas que envolvem tempo e rapidez de transferência de energia.",
  },
  "altura.modulo": {
    significado: "Distância vertical entre o corpo e o nível de referência escolhido.",
    exemplosNatureza: [
      "Andar de um prédio",
      "Altura de queda",
      "Nível da água em represa",
    ],
    quandoRelevante: "Energia potencial gravitacional e queda livre vertical.",
  },
  "momentoLinear.modulo": {
    significado:
      "Quantidade de movimento — produto da massa pela velocidade. Mede o 'ímpeto' do corpo em linha reta.",
    exemplosNatureza: [
      "Caminhão em velocidade (alto momento)",
      "Bola de bilhar em jogo",
      "Jogador em sprint",
    ],
    quandoRelevante: "Colisões, impulso e conservação de momento.",
  },
  "impulso.modulo": {
    significado:
      "Produto da força pelo tempo de aplicação. Mede a mudança de momento causada por uma força.",
    exemplosNatureza: [
      "Batida de taco no bilhar",
      "Airbag amortecendo colisão",
      "Chute em uma bola",
    ],
    quandoRelevante: "Colisões, impactos e teorema do impulso.",
  },
  "torque.modulo": {
    significado:
      "Momento de uma força em relação a um eixo — mede a capacidade de girar um corpo.",
    exemplosNatureza: [
      "Chave de boca girando parafuso",
      "Motor acionando roda",
      "Porta sendo empurrada na maçaneta",
    ],
    quandoRelevante: "Rotação, polias e equilíbrio de torques.",
  },
  "momentoInercia.modulo": {
    significado:
      "Inércia rotacional — mede a resistência de um corpo a mudanças em sua rotação.",
    exemplosNatureza: [
      "Disco girando",
      "Roda de bicicleta",
      "Cilindro rolando",
    ],
    quandoRelevante: "Dinâmica rotacional e 2ª lei de Newton para rotação.",
  },
  "momentoAngular.modulo": {
    significado:
      "Quantidade de movimento angular — versão rotacional do momento linear.",
    exemplosNatureza: ["Giroscópio", "Planeta em rotação", "Patinador girando"],
    quandoRelevante: "Conservação de momento angular e rotação.",
  },
  "forcaGravitacional.modulo": {
    significado:
      "Força de atração entre duas massas pela gravitação universal de Newton.",
    exemplosNatureza: [
      "Terra atraindo a Lua",
      "Sol atraindo planetas",
      "Dois corpos celestes",
    ],
    quandoRelevante: "Problemas com órbitas, planetas e distâncias astronômicas.",
  },
  "constanteGravitacional.modulo": {
    significado: "Constante de proporcionalidade da lei da gravitação universal (G ≈ 6,67×10⁻¹¹).",
    exemplosNatureza: ["Cálculos astronômicos", "Órbitas planetárias"],
    quandoRelevante: "Lei da gravitação universal entre dois corpos.",
  },
  "massaCorpo1.modulo": {
    significado: "Massa do corpo maior em problemas de gravitação (ex.: Sol, Terra).",
    exemplosNatureza: ["Massa do Sol", "Massa da Terra"],
    quandoRelevante: "Gravitação universal entre dois corpos distintos.",
  },
  "massaCorpo2.modulo": {
    significado: "Massa do segundo corpo em problemas de gravitação.",
    exemplosNatureza: ["Massa de um satélite", "Massa de um planeta menor"],
    quandoRelevante: "Gravitação universal entre dois corpos distintos.",
  },
  "distancia.modulo": {
    significado: "Distância entre os centros de massa dos dois corpos em gravitação.",
    exemplosNatureza: [
      "Distância Terra–Lua",
      "Raio orbital de satélite",
    ],
    quandoRelevante: "Lei da gravitação universal (força inversamente proporcional a r²).",
  },
};

export function obterMetadadosVariavel(id: string): MetadadosVariavel | undefined {
  return metadadosVariaveis[id];
}
