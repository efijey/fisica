/**
 * Exercícios modelo: o gerador imita o estilo destes textos.
 *
 * Edite à vontade — é aqui que se ajusta "o jeito que o exercício é escrito".
 * Cada modelo deve usar só fatos listados em mundos/catalog.ts.
 */
export interface ExemploModelo {
  mundoId: string
  cardId: string
  titulo: string
  contexto: string
  pergunta: string
  explicacao: string
  dica: string
}

export const exemplosModelo: ExemploModelo[] = [
  {
    mundoId: "tft",
    cardId: "vm_deslocamento_tempo",
    titulo: "O tanque que atravessou o tabuleiro",
    contexto:
      "Começa o combate. Seu tanque está na fileira de trás e anda reto até o inimigo mais próximo: são 4 hexes, e ele chega em 2 segundos. No round seguinte, o caminho está bloqueado e ele precisa contornar: passa por 6 hexes, mas termina no mesmo hex de antes, também em 2 segundos.",
    pergunta:
      "Nos dois rounds, a velocidade média do tanque foi a mesma ou diferente? Explique usando deslocamento e intervalo de tempo.",
    explicacao:
      "Velocidade média é o deslocamento dividido pelo intervalo de tempo (University Physics, OpenStax, seção 3.1). Ela depende só do ponto de partida e do ponto de chegada, não do caminho. Como o tanque saiu e chegou nos mesmos hexes em 2 s nos dois rounds, o deslocamento foi de 4 hexes nos dois casos e a velocidade média foi a mesma: 2 hexes por segundo. O contorno aumentou a distância percorrida, não o deslocamento.",
    dica: "Compare onde o tanque começou e onde terminou, não o caminho que ele fez.",
  },
  {
    mundoId: "lol",
    cardId: "aceleracao_media",
    titulo: "Buff de velocidade e recall",
    contexto:
      "Você está andando pela lane em velocidade constante. Pega um buff de velocidade de movimento e passa a andar mais rápido, e segue assim até a torre. Lá, para e começa o recall, ficando parado alguns segundos.",
    pergunta:
      "Em quais momentos dessa sequência existe aceleração e em quais não existe? Explique usando variação de velocidade e intervalo de tempo.",
    explicacao:
      "Aceleração média é a variação de velocidade dividida pelo intervalo de tempo (University Physics, OpenStax, seção 3.3). Andar em velocidade constante não tem aceleração, seja essa velocidade alta ou baixa, porque ela não muda. Existe aceleração quando o buff aumenta sua velocidade e quando você freia até parar para o recall. Nessa freada, a aceleração tem sentido oposto ao do movimento. Parado durante o recall, a velocidade não muda, então também não há aceleração.",
    dica: "Procure os momentos em que a velocidade muda, não os momentos em que ela é alta.",
  },
  {
    mundoId: "tft",
    cardId: "segunda_lei_newton",
    titulo: "Empurrão no carry e no tanque",
    contexto:
      "Imagine um modo de treino em que uma mesma força resultante empurra duas unidades suas ao mesmo tempo: o seu carry, leve, e o seu tanque, com massa bem maior. As duas começam paradas no mesmo hex.",
    pergunta:
      "Qual das duas unidades ganha mais velocidade no mesmo intervalo de tempo? Explique usando força resultante, massa e aceleração.",
    explicacao:
      "Pela segunda lei de Newton, a força resultante é igual à massa vezes a aceleração, F = m·a (University Physics, OpenStax, seção 5.3). Com a mesma força, quem tem mais massa sofre menos aceleração. O carry, mais leve, acelera mais e ganha mais velocidade no mesmo tempo. A massa mede a resistência a mudar o movimento: o tanque resiste mais.",
    dica: "Mesma força para as duas: o que muda entre elas, e o que isso faz com a aceleração?",
  },
]
