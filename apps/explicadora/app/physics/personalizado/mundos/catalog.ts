import type { MundoInteresse } from "@/app/physics/personalizado/tipos"

/**
 * Mundos do paciente zero.
 * Só estes fatos podem ser tratados como "verdade do jogo" na geração.
 * Prefira TFT/LoL com mecânicas estáveis (deslocamento, tempo de round, velocidade).
 */
export const mundosInteresse: MundoInteresse[] = [
  {
    id: "tft",
    nome: "Team Fight Tactics",
    descricao:
      "Autobattler: tabuleiro hexagonal, rounds com tempo, unidades que se movem e lutam automaticamente.",
    entidades: [
      "campeão",
      "unidade",
      "tabuleiro",
      "hex",
      "bench",
      "carousel",
      "round",
      "jogador",
    ],
    fatos: [
      {
        id: "tft-hex",
        texto:
          "O combate ocorre num tabuleiro de casas hexagonais; a distância entre unidades pode ser pensada em número de hexes.",
      },
      {
        id: "tft-round-time",
        texto:
          "Cada round de combate tem uma duração limitada em segundos; unidades se deslocam e atacam dentro desse intervalo.",
      },
      {
        id: "tft-move-fight",
        texto:
          "No início do combate as unidades andam até o alvo; depois alternam deslocamento curto e ataques — há mudança de velocidade ao iniciar o engajamento.",
      },
      {
        id: "tft-bench",
        texto:
          "Unidades no banco (bench) não participam do combate até serem colocadas no tabuleiro.",
      },
      {
        id: "tft-carousel",
        texto:
          "No carrossel, campeões giram e os jogadores escolhem um — há movimento periódico ao longo de um caminho.",
      },
    ],
  },
  {
    id: "lol",
    nome: "League of Legends",
    descricao:
      "MOBA: campeões com velocidade de movimento, dashes e deslocamentos em rota/tempo real.",
    entidades: [
      "campeão",
      "rota",
      "lane",
      "torre",
      "minion",
      "flash",
      "dash",
      "jungle",
      "base",
    ],
    fatos: [
      {
        id: "lol-ms",
        texto:
          "Cada campeão tem uma velocidade de movimento base (movement speed); itens e buffs podem alterá-la.",
      },
      {
        id: "lol-lane-distance",
        texto:
          "Rotas (lanes) têm comprimento percorrível; o tempo para ir da torre aliada à torre inimiga depende da velocidade de movimento.",
      },
      {
        id: "lol-flash",
        texto:
          "Flash é um deslocamento quase instantâneo numa distância curta — útil para contrastar com movimento contínuo ao longo do tempo.",
      },
      {
        id: "lol-dash",
        texto:
          "Muitos campeões têm dashes: percorrem uma distância em um intervalo curto de tempo (velocidade média alta nesse trecho).",
      },
      {
        id: "lol-recall",
        texto:
          "O recall canaliza por alguns segundos parado antes de teleportar à base — intervalo de tempo sem deslocamento no mapa.",
      },
    ],
  },
]

export function mundoPorId(id: string): MundoInteresse | undefined {
  return mundosInteresse.find((m) => m.id === id)
}
