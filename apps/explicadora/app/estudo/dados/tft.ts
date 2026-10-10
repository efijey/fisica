import set18 from "./tft-set18.json"

export const tftSet = set18

/** Falha no build se o campeão sumir de um snapshot novo. */
export function campeaoTft(nome: string) {
  const c = set18.campeoes.find((c) => c.nome === nome)
  if (!c) throw new Error(`Campeão "${nome}" não está no snapshot do set ${set18.set}`)
  if (c.dano === null) throw new Error(`Campeão "${nome}" está sem dano no snapshot`)
  return { ...c, dano: c.dano }
}

/** Número com vírgula decimal, pronto para LaTeX. */
export function texNum(n: number, casas = 2) {
  return n
    .toLocaleString("pt-BR", { maximumFractionDigits: casas })
    .replace(",", "{,}")
}

export const fonteTft = `${set18.fonte}. Set ${set18.set}, versão ${set18.versaoJogo}, dados baixados em ${set18.baixadoEm}.`
