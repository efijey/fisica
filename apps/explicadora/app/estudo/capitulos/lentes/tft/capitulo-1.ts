import { campeaoTft, fonteTft, texNum } from "../../../dados/tft"
import type { LenteCapitulo } from "../../tipos"

const r = String.raw

const xayah = campeaoTft("Xayah")
const reksai = campeaoTft("Rek'Sai")
const ornn = campeaoTft("Ornn")
const dpsXayah = xayah.dano * xayah.velocidadeAtaque
const dpsReksai = reksai.dano * reksai.velocidadeAtaque

export const lenteTftCapitulo1: LenteCapitulo = {
  mundoId: "tft",
  nome: "TFT",
  revisado: false,
  secoes: {
    "grandezas-unidades": {
      noJogo: {
        titulo: "Quem derruba o Ornn mais rápido: Xayah ou Rek'Sai?",
        texto: r`A Xayah dá \(${xayah.dano}\) de dano por ataque e ataca \(${texNum(xayah.velocidadeAtaque)}\) vezes por segundo. A Rek'Sai bate mais forte, \(${reksai.dano}\) por ataque, mas ataca só \(${texNum(reksai.velocidadeAtaque)}\) vezes por segundo. Multiplicando as duas grandezas, sai o dano por segundo (DPS), e as unidades mostram por quê: \[ \text{DPS} = \text{dano por ataque} \times \frac{\text{ataques}}{\mathrm{s}} \] \[ \text{Xayah: } ${xayah.dano} \times ${texNum(xayah.velocidadeAtaque)} = ${texNum(dpsXayah)}\ \tfrac{\text{dano}}{\mathrm{s}} \] \[ \text{Rek'Sai: } ${reksai.dano} \times ${texNum(reksai.velocidadeAtaque)} = ${texNum(dpsReksai)}\ \tfrac{\text{dano}}{\mathrm{s}} \] Dividindo a vida do Ornn (\(${ornn.vida}\)) pelo DPS, o “dano” se cancela e sobra tempo: \[ t = \frac{${ornn.vida}\ \text{dano}}{\text{DPS}\ \text{dano/s}} \] A Xayah leva cerca de \(${Math.round(ornn.vida / dpsXayah)}\ \mathrm{s}\); a Rek'Sai, cerca de \(${Math.round(ornn.vida / dpsReksai)}\ \mathrm{s}\). Bater mais forte não basta: o que decide é o produto das duas grandezas. E a análise de unidades diz qual conta faz sentido antes de você fazer qualquer uma.`,
        simplificacao:
          "Campeões com 1 estrela e sem itens; a conta ignora armadura, mana e habilidades.",
        fonte: fonteTft,
      },
      intuicao:
        "Quando alguém diz que um carry tem alcance 4, você entende porque sabe que o TFT mede alcance em hexes. Sem a unidade, “4” poderia ser 4 segundos ou 4 de ouro. Em física é igual: o número só faz sentido junto com a unidade.",
      exemplo: {
        enunciado: r`Um amigo diz que a distância que uma unidade anda no tabuleiro é \(d = v\,t^2\), com \(v\) em hexes por segundo e \(t\) em segundos. Pode estar certo?`,
        resolucao: r`Do lado esquerdo há hexes. Do lado direito, \(\tfrac{\text{hex}}{\mathrm{s}} \cdot \mathrm{s}^2 = \text{hex} \cdot \mathrm{s}\). As unidades não batem, então a fórmula está errada, sem precisar jogar nenhuma partida.`,
      },
      exercicio: {
        pergunta: r`Um guia de TFT afirma que a velocidade de uma unidade é \(v = \dfrac{d}{t^2}\), com \(d\) em hexes e \(t\) em segundos. Sem usar nenhum número, como você mostra que essa fórmula está errada?`,
        dica: "Olhe para as unidades de medida de cada lado do sinal de igual.",
        rubrica: {
          conceitosObrigatorios: [
            "unidades de medida|unidade de medida|dimens|hex/s|hex por segundo|hexes por segundo",
            "comparar os dois lados|lado|batem|bate|iguais|mesma|compar|diferente",
          ],
          conceitosAlternativos: ["unidades|unidade"],
          minObrigatorios: 2,
        },
        explicacao: r`Compare as unidades de medida dos dois lados. Velocidade sai em hexes por segundo. O lado direito dá hexes por segundo ao quadrado, que é unidade de aceleração. Como não batem, a fórmula não pode estar certa.`,
      },
    },
    conversao: {
      intuicao:
        "Um round que dura meio minuto continua do mesmo tamanho se você disser 30 segundos. Trocar de unidade não muda o tempo nem a distância, só a régua usada para contar.",
      exemplo: {
        enunciado: r`Suponha que uma unidade ande \(2\) hexes por segundo. Quanto é isso em hexes por minuto?`,
        resolucao: r`Uma fração que vale 1 troca segundos por minutos: \[ 2\ \frac{\text{hex}}{\mathrm{s}} \cdot \frac{60\ \mathrm{s}}{1\ \mathrm{min}} = 120\ \frac{\text{hex}}{\mathrm{min}} \] Os segundos se cancelam; sobra hex por minuto.`,
      },
      exercicio: {
        pergunta: r`Você vai imprimir o tabuleiro do TFT para jogar na mesa. A área de cada hex impresso foi medida em \(\mathrm{m}^2\), e um amigo converte para \(\mathrm{cm}^2\) multiplicando por 100. Por que isso está errado?`,
        dica: "Área tem duas dimensões. O que acontece com cada uma delas na conversão?",
        explicacao: r`Cada metro vira 100 cm na largura do hex e também no comprimento, então \(1\ \mathrm{m}^2 = 100 \times 100\ \mathrm{cm}^2 = 10^{4}\ \mathrm{cm}^2\). O fator do comprimento entra ao quadrado.`,
      },
    },
    "algarismos-significativos": {
      intuicao:
        "Se você cronometra um combate no olho, com o relógio do celular, não dá para afirmar que ele durou 27,384 segundos. Seu dedo no botão não é tão preciso: a medida só garante poucos dígitos.",
      exercicio: {
        pergunta: r`Você cronometra no olho que uma unidade levou \(1{,}2\ \mathrm{s}\) para cruzar 3 hexes. Para saber o tempo por hex, divide por 3 e a calculadora mostra \(0{,}4000000\). Por que não faz sentido escrever todos esses dígitos?`,
        dica: "Quem decide quantos dígitos são confiáveis: a calculadora ou o seu cronômetro?",
        explicacao: r`O resultado não pode ser mais preciso que a medida. O cronômetro no olho deu 2 algarismos significativos, então o resultado fica com 2: \(0{,}40\ \mathrm{s}\) por hex. Os outros zeros foram inventados pela calculadora.`,
      },
    },
    "ordem-de-grandeza": {
      intuicao:
        "Antes de olhar o relógio, todo jogador sabe que uma partida de TFT dura dezenas de minutos, não segundos nem dias. Esse “tamanho aproximado” é a ordem de grandeza, e é o que faz você estranhar quando alguém diz um número absurdo.",
      exemplo: {
        enunciado:
          "Quantos segundos você passa jogando TFT num mês, se joga umas 2 partidas por dia, de uns 30 minutos cada?",
        resolucao: r`Uma hora de jogo por dia, ou seja, \(3600\ \mathrm{s}\); um mês tem uns 30 dias: \[ 3600 \cdot 30 \approx 1 \times 10^{5}\ \mathrm{s} \] Ordem de grandeza: \(10^{5}\) segundos.`,
      },
      exercicio: {
        pergunta: r`Um amigo diz que uma partida de TFT dura uns \(10^{5}\) segundos. Sem calcular com precisão, como você mostra que isso não faz sentido?`,
        criterios: [
          "Converta a duração típica de uma partida para segundos, mesmo que aproximada.",
          "Compare com o número do amigo e diga o tamanho do erro.",
        ],
        dica: "Converta a duração típica de uma partida para segundos e compare as potências de 10.",
        rubrica: {
          conceitosObrigatorios: [
            "duração em minutos|minuto|hora",
            "converter para segundos|60|3600|segundos por minuto|segundo",
            "comparar as potências de 10|potencia|ordem de grandeza|grande demais|muito maior|exager|dia|10 3|mil",
          ],
          minObrigatorios: 2,
        },
        explicacao: r`Uma partida dura dezenas de minutos: \(30\ \mathrm{min} \times 60\ \mathrm{s} \approx 2 \times 10^{3}\ \mathrm{s}\), ordem de grandeza \(10^{3}\). Já \(10^{5}\ \mathrm{s}\) é mais que um dia inteiro. O amigo errou por um fator de cem.`,
      },
    },
    vetores: {
      intuicao:
        "Dizer que uma unidade andou 3 hexes não diz onde ela parou: depende da direção. Ela pode ter avançado 3 hexes rumo ao inimigo ou ter ido e voltado.",
      exemplo: {
        enunciado:
          "Uma unidade anda 3 hexes em linha reta para a frente e depois 3 hexes para trás, voltando ao hex onde começou. Qual é o deslocamento?",
        resolucao: r`Os dois movimentos têm o mesmo módulo e sentidos opostos: \[ \vec{R} = \vec{A} + (-\vec{A}) = \vec{0} \] Ela andou 6 hexes no total, mas o deslocamento é zero. Essa diferença entre distância percorrida e deslocamento volta no capítulo 2.`,
      },
      exercicio: {
        pergunta:
          "Imagine que dois campeões empurram o mesmo inimigo ao mesmo tempo, cada um com um empurrão do mesmo tamanho. Em que situação o inimigo não sai do lugar, e em que situação ele é empurrado o mais longe possível? Por que somar só os tamanhos dos empurrões não basta?",
        criterios: [
          "Descreva as duas situações: inimigo parado e inimigo empurrado o mais longe possível.",
          "Explique o que, além do tamanho, entra na soma dos empurrões.",
        ],
        dica: "Empurrão é vetor: além do tamanho, importa para onde cada campeão empurra.",
        explicacao:
          "Empurrão é vetor. Empurrando em sentidos opostos, um cancela o outro e o inimigo fica parado. Empurrando no mesmo sentido, o efeito dobra. Em qualquer outro ângulo, o resultado fica entre esses dois. Somar só os tamanhos ignora a direção.",
      },
    },
    componentes: {
      intuicao: r`Um movimento na diagonal do tabuleiro pode ser pensado como “quanto vai para o lado” mais “quanto vai para a frente”. Separar assim transforma vários movimentos em somas simples, uma para cada eixo.`,
      exercicio: {
        pergunta: r`Um assassino inimigo pula para a retaguarda do seu time, e o seu carry atira nele: o projétil vai para trás e para a esquerda. Tomando \(x\) para a direita e \(y\) para a frente, quais são os sinais das componentes \(A_x\) e \(A_y\) do vetor do projétil? Por que isso importa na hora de usar o \(\arctan\) da calculadora?`,
        dica: "Divida uma componente negativa por outra negativa e veja o sinal que sobra.",
        explicacao: r`As duas componentes são negativas: o vetor está no terceiro quadrante. Como \(A_y / A_x\) fica positivo, a calculadora devolve um ângulo do primeiro quadrante, apontando para a frente e para a direita, o lado errado. É preciso somar \(180^\circ\) para chegar ao ângulo certo.`,
      },
    },
    "vetores-unitarios": {
      intuicao:
        "Pense no vetor unitário como a seta que diz para onde a unidade está indo. O número na frente diz quantos hexes ela anda nessa direção.",
      exercicio: {
        pergunta: r`Uma unidade avança \((2\ \text{hex})\,\hat{\jmath}\) e outra recua \((-2\ \text{hex})\,\hat{\jmath}\). O que muda e o que não muda entre esses dois deslocamentos?`,
        dica: "Pense separadamente em tamanho, direção e sentido.",
        explicacao: r`Os dois têm o mesmo módulo, 2 hexes, e a mesma direção, a do eixo \(y\). Só o sentido muda: o primeiro aponta para a frente (\(+y\)) e o segundo para trás (\(-y\)).`,
      },
    },
    produtos: {
      intuicao:
        "Nem todo empurrão ajuda uma unidade a chegar ao alvo: só a parte que aponta para o alvo conta. O produto escalar mede exatamente isso, quanto um vetor aponta na direção do outro.",
      exercicio: {
        pergunta:
          "Uma unidade caminha em linha reta rumo ao alvo, mas um efeito a empurra na diagonal, um pouco para o lado e um pouco para a frente. Que parte desse empurrão ajuda a unidade a chegar ao alvo? Que produto de vetores descreve isso?",
        criterios: [
          "Diga qual parte do empurrão ajuda, usando a ideia de componente.",
          "Diga o nome do produto de vetores que faz essa conta.",
        ],
        dica: "Quebre o empurrão em uma parte na direção do alvo e uma parte de lado.",
        rubrica: {
          conceitosObrigatorios: [
            "componente na direção do movimento|para a frente|frente|direcao do alvo|rumo ao alvo|componente|paralel|direcao do movimento",
            "produto escalar|escalar|cos|produto ponto",
          ],
          minObrigatorios: 1,
        },
        explicacao: r`Só a componente do empurrão que aponta para o alvo, a parte para a frente, ajuda a unidade a chegar lá. O produto escalar \(\vec{F} \cdot \vec{d} = Fd\cos\phi\) pega exatamente essa parte paralela. É a ideia de trabalho, que volta no capítulo 6. A parte de lado só tira a unidade da linha reta.`,
      },
    },
  },
}
