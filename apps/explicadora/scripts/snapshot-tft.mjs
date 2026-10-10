// Baixa os atributos dos campeões de um set do TFT (CommunityDragon) e salva uma
// cópia pequena no repo. Rodar de propósito, a cada set novo:
//   npm run snapshot-tft            (set 18)
//   TFT_SET=19 npm run snapshot-tft
import { mkdir, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const SET = process.env.TFT_SET ?? "18"
const BASE = "https://raw.communitydragon.org/latest"
const URL_DADOS = `${BASE}/cdragon/tft/pt_br.json`

async function baixarJson(url) {
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`${url} respondeu ${resp.status}`)
  return resp.json()
}

const [dados, meta] = await Promise.all([
  baixarJson(URL_DADOS),
  baixarJson(`${BASE}/content-metadata.json`),
])

const set = dados.sets[SET]
if (!set) throw new Error(`Set ${SET} não existe. Disponíveis: ${Object.keys(dados.sets)}`)

const campeoes = set.champions
  .filter((c) => c.traits.length > 0 && c.cost >= 1 && c.cost <= 5)
  .map((c) => ({
    nome: c.name,
    custo: c.cost,
    caracteristicas: c.traits,
    velocidadeAtaque: Number(c.stats.attackSpeed.toFixed(3)),
    dano: c.stats.damage,
    vida: c.stats.hp,
    armadura: c.stats.armor,
    alcanceHexes: c.stats.range,
    mana: c.stats.mana,
  }))
  .sort((a, b) => a.custo - b.custo || a.nome.localeCompare(b.nome, "pt-BR"))

const snapshot = {
  fonte: "CommunityDragon (dados extraídos dos arquivos do jogo; não oficial)",
  url: URL_DADOS,
  versaoJogo: meta.version.split("+")[0],
  set: Number(SET),
  baixadoEm: new Date().toISOString().slice(0, 10),
  observacao:
    "Atributos base de campeão com 1 estrela, sem itens. velocidadeAtaque em ataques por segundo; alcance em hexes.",
  campeoes,
}

const destino = join(
  dirname(fileURLToPath(import.meta.url)),
  `../app/estudo/dados/tft-set${SET}.json`
)
await mkdir(dirname(destino), { recursive: true })
await writeFile(destino, JSON.stringify(snapshot, null, 2) + "\n")
console.log(`${campeoes.length} campeões do set ${SET} (versão ${snapshot.versaoJogo}) → ${destino}`)
