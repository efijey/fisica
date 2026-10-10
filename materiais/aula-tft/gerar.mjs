// Gera o material de apoio da aula "Física para vencer no TFT":
// planilhas CSV (campeões, itens, habilidades) e um PDF para o professor.
// Uso: node materiais/aula-tft/gerar.mjs  (TFT_SET=18 por padrão)
import { writeFileSync } from "node:fs"
import { join } from "node:path"
import {
  BASE, DADOS, HIPOTESE, MEDIR, MODELO, REGRA, SET,
  baixar, esc, estilo, fmt, gerarPdf, legendaEtiquetas, md, mi, n, saida, versaoDoJogo,
} from "./comum.mjs"

const dados = baixar(`${BASE}/cdragon/tft/pt_br.json`, "pt_br.json")
const versao = versaoDoJogo()
const baixadoEm = new Date().toISOString().slice(0, 10)
const fonte = `CommunityDragon (dados extraídos dos arquivos do jogo; não oficial). Set ${SET}, versão ${versao}, baixado em ${baixadoEm}.`

// ---------- campeões ----------
const p = 0.25
const m = 1.4
const campeoes = dados.sets[SET].champions
  .filter((c) => c.traits.length > 0 && c.cost >= 1 && c.cost <= 5 && !/^Lux \(/.test(c.name))
  .map((c) => {
    const bin = baixar(`${BASE}/game/characters/${c.apiName.toLowerCase()}.cdtb.bin.json`, `${c.apiName.toLowerCase()}.json`)
    const raiz = Object.entries(bin).find(([k]) => k.endsWith("CharacterRecords/Root"))?.[1] ?? {}
    const s = c.stats
    const dps = s.damage == null ? null : s.damage * s.attackSpeed
    return {
      nome: c.name,
      custo: c.cost,
      caracteristicas: c.traits.join(", "),
      vida: s.hp,
      armadura: s.armor,
      rm: s.magicResist,
      dano: s.damage,
      vel: Math.round(s.attackSpeed * 1000) / 1000,
      dps,
      dpsCrit: dps == null ? null : dps * (1 + s.critChance * (s.critMultiplier - 1)),
      vidaEfFis: s.hp * (1 + s.armor / 100),
      vidaEfMag: s.hp * (1 + s.magicResist / 100),
      alcanceHex: s.range,
      alcanceUn: raiz.attackRangeModifiable?.baseValue ?? null,
      movimento: raiz.baseMoveSpeedModifiable?.baseValue ?? null,
      manaIni: s.initialMana,
      manaMax: s.mana,
      critChance: s.critChance,
      critMult: Math.round(s.critMultiplier * 100) / 100,
      habilidade: c.ability,
    }
  })
  .sort((a, b) => a.custo - b.custo || a.nome.localeCompare(b.nome, "pt-BR"))

const porNome = (n) => campeoes.find((c) => c.nome === n)

// ---------- habilidades ----------
function limparDescricao(desc) {
  return desc
    .replace(/\\r|\\n|\r|\n/g, " ")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/%i:[^%]+%/g, "")
    .replace(/@[^@]+@/g, "▢")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}
const sinaisArea = /área|cônic|adjacente|ao redor|inimigos (mais )?próximos|todos os inimigos|em linha|em cone|onda|explo|ricochete|salta|atravessa|em volta|raio/i
const habilidades = campeoes.map((c) => {
  const texto = limparDescricao(c.habilidade.desc)
  const tipos = [
    /Dano Físico/i.test(texto) && "físico",
    /Dano Mágico/i.test(texto) && "mágico",
    /Dano Verdadeiro/i.test(texto) && "verdadeiro",
  ].filter(Boolean)
  return { nome: c.nome, custo: c.custo, habilidade: c.habilidade.name, tipos: tipos.join(" + ") || "—", area: sinaisArea.test(texto), texto }
})

// ---------- itens ----------
// AD vem às vezes como fração (0,1) e às vezes já em porcentagem (15).
const nomesStat = {
  AD: ["Dano de Ataque", (v) => `+${fmt(v > 1 ? v : v * 100, 0)}%`],
  AP: ["Poder de Habilidade", (v) => `+${fmt(v, 0)}`],
  AS: ["Velocidade de Ataque", (v) => `+${fmt(v, 0)}%`],
  Armor: ["Armadura", (v) => `+${fmt(v, 0)}`],
  MagicResist: ["Resistência Mágica", (v) => `+${fmt(v, 0)}`],
  Health: ["Vida", (v) => `+${fmt(v, 0)}`],
  CritChance: ["Chance de Crítico", (v) => `+${fmt(v, 0)}%`],
  ManaRegen: ["Mana por segundo", (v) => `+${fmt(v, 0)}`],
}
const receitas = dados.items.filter((i) => i.apiName.startsWith("TFT_Item_") && i.composition?.length)
const apiComponentes = new Set(receitas.flatMap((i) => i.composition))
const tipoItem = (i) => (i.composition?.length ? "completo" : apiComponentes.has(i.apiName) ? "componente" : "especial")
const ordemTipo = { componente: 0, completo: 1, especial: 2 }
const vistos = new Set()
const itens = dados.items
  .filter((i) => i.apiName.startsWith("TFT_Item_") && i.name && !i.name.startsWith("tft_item_name"))
  .filter((i) => i.composition?.length || Object.keys(i.effects).some((k) => k in nomesStat))
  .sort((a, b) => ordemTipo[tipoItem(a)] - ordemTipo[tipoItem(b)])
  .filter((i) => (vistos.has(i.name) ? false : vistos.add(i.name)))
  .map((i) => {
    const comp = (i.composition ?? []).map((a) => dados.items.find((x) => x.apiName === a)?.name ?? a)
    const stats = Object.entries(i.effects)
      .filter(([k, v]) => k in nomesStat && v != null)
      .map(([k, v]) => `${nomesStat[k][0]} ${nomesStat[k][1](v)}`)
    const descricao = (i.desc ?? "")
      .replace(/<br\s*\/?>/g, " ")
      .replace(/<[^>]+>/g, "")
      .replace(/\{\{[^}]+\}\}/g, "")
      .replace(/%i:[^%]+%/g, "")
      .replace(/@([^@*]+)(\*100)?@/g, (_, k, x100) => {
        const v = i.effects[k]
        return typeof v === "number" ? fmt(x100 ? v * 100 : v, 2) : "▢"
      })
      .replace(/@[^@]+@/g, "▢")
      .replace(/\s+/g, " ")
      .trim()
    return { nome: i.name, tipo: tipoItem(i), receita: comp.join(" + "), stats: stats.join("; "), descricao, efeitos: i.effects }
  })
  .sort((a, b) => ordemTipo[a.tipo] - ordemTipo[b.tipo] || a.nome.localeCompare(b.nome, "pt-BR"))
const item = (n) => itens.find((i) => i.nome === n)

// ---------- formatação ----------
function csv(arquivo, cabecalho, linhas) {
  const cel = (v) => {
    if (v == null) return ""
    if (typeof v === "number") return String(Math.round(v * 1000) / 1000).replace(".", ",")
    const s = String(v)
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const corpo = [cabecalho, ...linhas].map((l) => l.map(cel).join(";")).join("\n")
  writeFileSync(join(saida, arquivo), "\uFEFF" + corpo + "\n")
}

csv(
  "campeoes.csv",
  ["Campeão", "Custo", "Características", "Vida", "Armadura", "Resistência mágica", "Dano por ataque", "Velocidade de ataque (ataques/s)", "DPS base", "DPS esperado com crítico", "Vida efetiva contra físico", "Vida efetiva contra mágico", "Alcance (hexes)", "Alcance (unidades do jogo)", "Velocidade de movimento (unidades/s)", "Mana inicial", "Mana máxima", "Chance de crítico", "Multiplicador de crítico"],
  campeoes.map((c) => [c.nome, c.custo, c.caracteristicas, c.vida, c.armadura, c.rm, c.dano, c.vel, c.dps, c.dpsCrit, c.vidaEfFis, c.vidaEfMag, c.alcanceHex, c.alcanceUn, c.movimento, c.manaIni, c.manaMax, c.critChance, c.critMult]),
)
csv(
  "itens.csv",
  ["Item", "Tipo", "Receita", "Atributos", "Efeito"],
  itens.map((i) => [i.nome, i.tipo, i.receita, i.stats, i.descricao]),
)
csv(
  "habilidades.csv",
  ["Campeão", "Custo", "Habilidade", "Tipo de dano (pelo texto)", "Sinal de área (pelo texto)", "Descrição (▢ = valor que não vem nos dados)"],
  habilidades.map((h) => [h.nome, h.custo, h.habilidade, h.tipos, h.area ? "sim" : "não", h.texto]),
)

// ---------- contas da aula ----------
const xayah = porNome("Xayah")
const ornn = porNome("Ornn")
const ashe = porNome("Ashe")
const reksai = porNome("Rek'Sai")

const fatorArm = (a) => 100 / (100 + a)
const golpeArm = xayah.dano * fatorArm(ornn.armadura)
const dpsArm = golpeArm * xayah.vel
const multCrit = 1 + p * (m - 1)

const cota = item("Cota de Malha")
const cinto = item("Cinto do Gigante")
const luvas = item("Luvas do Pugilista")
const arco = item("Arco Recurvo")
const guinsoo = item("Lâmina da Fúria de Guinsoo")
const armCota = cota.efeitos.Armor
const vidaCinto = cinto.efeitos.Health
const ehp = (h, a) => h * (1 + a / 100)
const ehpOrnn = ehp(ornn.vida, ornn.armadura)
const ehpCota = ehp(ornn.vida, ornn.armadura + armCota)
const ehpCinto = ehp(ornn.vida + vidaCinto, ornn.armadura)
const limiarVida = (vidaCinto * (100 + ornn.armadura)) / armCota

const pLuvas = p + luvas.efeitos.CritChance / 100
const multLuvas = 1 + pLuvas * (m - 1)
const ganhoLuvas = multLuvas / multCrit - 1
const ganhoArco = arco.efeitos.AS / 100

const asBaseG = guinsoo.efeitos.AS / 100
const asPorSeg = guinsoo.efeitos.AttackSpeedPerStack / 100
const T = 10
const ataquesSem = xayah.vel * T
const ataquesGuinsoo = xayah.vel * ((1 + asBaseG) * T + (asPorSeg * T * T) / 2)

const distancia = ashe.alcanceUn - porNome("Ornn").alcanceUn
const tempoAproximar = distancia / ornn.movimento
const ataquesAshe = tempoAproximar * ashe.vel

const alcances = [...new Map(campeoes.filter((c) => c.alcanceUn).map((c) => [c.alcanceHex, c.alcanceUn])).entries()].sort((a, b) => a[0] - b[0])
const movimentos = [...new Set(campeoes.map((c) => c.movimento))]

const tabelaArmadura = [0, 20, 40, 60, 100, 200]
  .map((a) => `<tr><td>${a}</td><td>${fmt(100 * fatorArm(a), 1)}%</td><td>${fmt(100 - 100 * fatorArm(a), 1)}%</td><td>${fmt(1 + a / 100, 2)}×</td></tr>`)
  .join("")

const linhasCampeoes = campeoes
  .map(
    (c) => `<tr><td class="nome">${esc(c.nome)}</td><td>${c.custo}</td><td>${c.vida}</td><td>${c.armadura}</td><td>${c.rm}</td><td>${fmt(c.dano, 0)}</td><td>${fmt(c.vel, 2)}</td><td>${fmt(c.dps, 1)}</td><td>${fmt(c.dpsCrit, 1)}</td><td>${fmt(c.vidaEfFis, 0)}</td><td>${fmt(c.vidaEfMag, 0)}</td><td>${c.alcanceHex}</td><td>${c.manaIni}/${c.manaMax}</td></tr>`,
  )
  .join("")

const linhasHabilidades = habilidades
  .map((h) => `<tr><td class="nome">${esc(h.nome)}<br><small>${esc(h.habilidade)}</small></td><td>${h.tipos}</td><td>${h.area ? "sim" : "—"}</td><td class="desc">${esc(h.texto)}</td></tr>`)
  .join("")

const linhasItens = itens
  .map((i) => `<tr><td class="nome">${esc(i.nome)}</td><td>${esc(i.receita || i.tipo)}</td><td>${esc(i.stats || "—")}</td><td class="desc">${esc(i.descricao)}</td></tr>`)
  .join("")

const comArea = habilidades.filter((h) => h.area).map((h) => h.nome)

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Física para vencer no TFT — apoio do professor</title>
${estilo}</head><body>

<h1>Física para vencer no TFT</h1>
<div class="sub">Parte 1 — material de apoio do professor: roteiro, guia de mecânicas, contas prontas e tabelas</div>
<p class="pequeno">${esc(fonte)}</p>

${legendaEtiquetas}

<h2>1. Roteiro da aula (cerca de 45 minutos)</h2>
<p>A ideia central: <b>cada atributo do jogo é uma grandeza física</b>, e entender a grandeza muda a decisão. A física não joga por você, mas te diz qual pergunta fazer.</p>

<div class="caixa aula"><b>Gancho (3 min).</b> Mostre Xayah, Rek'Sai e Ornn. Pergunte à turma: <i>quem derruba o Ornn mais rápido?</i> Deixe votarem antes de qualquer conta. A maioria olha só o dano por ataque (Rek'Sai ${reksai.dano} contra Xayah ${xayah.dano}) e erra.</div>
<div class="caixa aula"><b>Bloco 1 — DPS é uma taxa (7 min).</b> Dano por segundo = dano por ataque × ataques por segundo. Unidades: ${mi(String.raw`\frac{\text{dano}}{\text{ataque}} \cdot \frac{\text{ataques}}{\mathrm{s}} = \frac{\text{dano}}{\mathrm{s}}`)}. Tempo para derrubar = vida ÷ DPS. Conta na seção 3.1.</div>
<div class="caixa aula"><b>Bloco 2 — o modelo fica mais real: armadura (8 min).</b> Refaça a conta com a armadura do Ornn: o tempo sobe de ~${Math.round(ornn.vida / xayah.dps)} s para ~${Math.round(ornn.vida / dpsArm)} s. Lição de física: todo modelo simplifica; o bom físico sabe o que deixou de fora e quanto isso pesa. Conta na seção 3.2.</div>
<div class="caixa aula"><b>Bloco 3 — vida ou armadura? (8 min).</b> Mesmo tanque, dois itens. Qual protege mais? Existe um ponto de virada que depende da vida do campeão. Conta na seção 3.3.</div>
<div class="caixa aula"><b>Bloco 4 — crítico e valor esperado (5 min).</b> Crítico é sorte, mas a média não é. ${mi(String.raw`25\%`)} de chance de causar ${mi(String.raw`1{,}4\times`)} vale, em média, ${mi(String.raw`+10\%`)} de dano. Conta na seção 3.4.</div>
<div class="caixa aula"><b>Bloco 5 — Guinsoo e aceleração (7 min).</b> Um item que aumenta a velocidade de ataque a cada segundo: a taxa de ataques cresce com o tempo, e o total de ataques é a área sob o gráfico. Ponte direta para o capítulo 2 (movimento e cálculo). Conta na seção 3.5.</div>
<div class="caixa aula"><b>Bloco 6 — posicionamento: velocidade, distância e área (5 min).</b> Quanto tempo um corpo a corpo leva para alcançar a Ashe? E por que espalhar o time contra habilidades em área? Seções 3.6 e 3.7.</div>
<div class="caixa aula"><b>Fechamento (2 min).</b> Proponha medir no jogo as regras que este material marca como ${REGRA}: é física experimental de verdade (seção 4).</div>

<h2 class="quebra">2. Guia de mecânicas</h2>

<h3>2.1 Ataque básico e DPS</h3>
<p>${DADOS} Cada campeão tem dano por ataque ${mi("D")} e velocidade de ataque ${mi("v")} (ataques por segundo).
${MODELO} Sem armadura, crítico, mana nem habilidade, o dano por segundo é ${mi(String.raw`\text{DPS} = D \cdot v`)} e o tempo para derrubar um alvo com vida ${mi("H")} é ${mi(String.raw`t = H / \text{DPS}`)}.</p>
<p>${REGRA} Bônus de velocidade de ataque (itens, características) são porcentagens que <b>somam entre si</b> e multiplicam a velocidade base: ${mi(String.raw`v = v_0\,(1 + \textstyle\sum \text{bônus})`)}. Por isso dois Arcos Recurvos dão ${mi(String.raw`+20\%`)}, não ${mi(String.raw`+21\%`)}.</p>

<h3>2.2 Acerto crítico</h3>
<p>${DADOS} Todos os campeões do set começam com ${fmt(p * 100, 0)}% de chance de crítico e crítico de ${fmt(m, 1)}× o dano (os arquivos guardam ${mi("1{,}399999976")}).
${MODELO} Em muitos ataques, o dano médio por ataque é o valor esperado:</p>
${md(String.raw`\bar D = D\,\big(1 + p\,(m-1)\big) = D\,(1 + ${n(p)} \cdot ${n(m - 1, 1)}) = ${n(multCrit)}\,D`)}
<p class="pequeno">O Gume do Infinito e a Manopla Adornada dão a palavra-chave “Precisão”, cujo efeito não vem descrito nos dados. Conferir no jogo antes de usar em conta.</p>

<h3>2.3 Armadura e resistência mágica</h3>
<p>${REGRA} Armadura reduz dano físico; resistência mágica (RM) reduz dano mágico, pela mesma fórmula:</p>
${md(String.raw`\text{dano recebido} = \text{dano} \cdot \frac{100}{100 + A}`)}
<p>${MODELO} Equivalentemente, o alvo “aguenta” mais dano bruto antes de cair. É a <b>vida efetiva</b>:</p>
${md(String.raw`H_{\text{ef}} = H \cdot \left(1 + \frac{A}{100}\right)`)}
<table><tr><th>Armadura ${mi("A")}</th><th>Dano que passa</th><th>Redução</th><th>Multiplicador da vida efetiva</th></tr>${tabelaArmadura}</table>
<p><b>Ponto bom para discutir:</b> a porcentagem de redução cresce cada vez mais devagar (retorno decrescente: de 0 para 100 de armadura reduz 50%; de 100 para 200, só mais 16,7 pontos), mas a vida efetiva cresce em linha reta: cada ponto de armadura vale sempre +1% da vida. As duas frases são verdadeiras ao mesmo tempo, e a segunda é a que importa para decidir item.</p>
<p>Dano verdadeiro ignora as duas resistências. “Fatiamento” e “Fragmentação” (efeitos de itens como Último Sussurro e Cajado do Vazio) reduzem a armadura ou a RM do alvo em uma porcentagem por alguns segundos ${DADOS}.</p>

<h3>2.4 Mana e habilidades</h3>
<p>${DADOS} Cada campeão tem mana inicial e mana máxima (tabela da seção 5). Ao encher a mana, conjura a habilidade.
${MEDIR} Quanto de mana cada ataque dá <b>não</b> está no registro do campeão (aparece como 0, porque é regra geral do jogo). Itens como a Lança de Shojin dão mana extra por ataque (+${item("Lança de Shojin").efeitos.FlatManaRestore}) ${DADOS}.</p>
<p>${MODELO} Se cada ataque dá ${mi("q")} de mana, o tempo até a primeira habilidade é ${mi(String.raw`t = \dfrac{M_{\max} - M_0}{q \cdot v}`)}: mais velocidade de ataque também acelera a habilidade.</p>
<p><b>Dano das habilidades:</b> os arquivos públicos trazem o texto da habilidade, mas os números vêm como variáveis sem valor (marcadas com ▢ na seção 6). Para uma conta em aula, leia o valor no tooltip do jogo e preencha a planilha <code>habilidades.csv</code>.</p>

<h3>2.5 Alcance e movimento</h3>
<p>${DADOS} O alcance aparece em hexes no jogo e em unidades internas nos arquivos. Todos os campeões do set andam a ${movimentos.map((v) => fmt(v, 0)).join(", ")} unidades por segundo.</p>
<table><tr><th>Alcance (hexes)</th>${alcances.map(([h]) => `<td>${h}</td>`).join("")}</tr><tr><th>Alcance (unidades)</th>${alcances.map(([, u]) => `<td>${fmt(u, 0)}</td>`).join("")}</tr><tr><th>Unidades por hex</th>${alcances.map(([h, u]) => `<td>${fmt(u / h, 0)}</td>`).join("")}</tr></table>
<p><b>Investigação para a turma:</b> a conversão de hexes para unidades é proporcional? A última linha diz que não (a razão varia). Uma boa discussão sobre “rótulo arredondado” versus “medida”.</p>

<h3>2.6 Dano em área</h3>
<p>${MODELO} Se uma habilidade acerta ${mi("N")} inimigos com dano ${mi("d")} cada, o dano total é ${mi(String.raw`N \cdot d`)}. ${mi("N")} depende de quantos inimigos cabem na área: é uma <b>densidade</b> (inimigos por hex) vezes a área atingida. Espalhar o time diminui a densidade, e com ela o dano total que a habilidade inimiga causa.</p>
<p>${DADOS} Pelo texto das habilidades, estes campeões têm sinal de dano em área (busca automática por palavras como “área”, “cone”, “adjacentes”; confirme no jogo): ${comArea.map(esc).join(", ") || "nenhum encontrado"}.</p>

<h3>2.7 Nível de estrelas</h3>
<p>${MEDIR} Ao combinar 3 cópias, o campeão vira 2 estrelas e fica mais forte. Os multiplicadores não estão nestes dados. Atividade: no jogo, passe o mouse num campeão de 1 e de 2 estrelas e calcule a razão da vida e a do dano. As duas razões são iguais?</p>

<h2 class="quebra">3. Contas prontas, com resposta</h2>

<h3>3.1 Quem derruba o Ornn mais rápido? ${DADOS}${MODELO}</h3>
${md(String.raw`\text{DPS}_{\text{Xayah}} = ${xayah.dano} \cdot ${n(xayah.vel)} = ${n(xayah.dps, 1)}\ \tfrac{\text{dano}}{\mathrm{s}} \qquad \text{DPS}_{\text{Rek'Sai}} = ${reksai.dano} \cdot ${n(reksai.vel)} = ${n(reksai.dps, 1)}\ \tfrac{\text{dano}}{\mathrm{s}}`)}
${md(String.raw`t_{\text{Xayah}} = \frac{${ornn.vida}}{${n(xayah.dps, 1)}} \approx ${Math.round(ornn.vida / xayah.dps)}\ \mathrm{s} \qquad t_{\text{Rek'Sai}} = \frac{${ornn.vida}}{${n(reksai.dps, 1)}} \approx ${Math.round(ornn.vida / reksai.dps)}\ \mathrm{s}`)}
<div class="caixa resposta">A Xayah ganha, mesmo com menos dano por ataque: ataca mais vezes por segundo. Moral: compare taxas, não números soltos.</div>

<h3>3.2 Agora com a armadura do Ornn ${DADOS}${REGRA}</h3>
<p>O Ornn tem ${ornn.armadura} de armadura e o ataque da Xayah é físico.</p>
${md(String.raw`D_{\text{efetivo}} = ${xayah.dano} \cdot \frac{100}{100 + ${ornn.armadura}} \approx ${n(golpeArm, 1)} \qquad \text{DPS} = ${n(golpeArm, 1)} \cdot ${n(xayah.vel)} \approx ${n(dpsArm, 1)} \qquad t = \frac{${ornn.vida}}{${n(dpsArm, 1)}} \approx ${Math.round(ornn.vida / dpsArm)}\ \mathrm{s}`)}
<p>Com o crítico médio (seção 2.2): ${mi(String.raw`\text{DPS} \approx ${n(dpsArm * multCrit, 1)}`)}, ${mi(String.raw`t \approx ${Math.round(ornn.vida / (dpsArm * multCrit))}\ \mathrm{s}`)}.</p>
<div class="caixa resposta">A armadura aumentou o tempo em ~${fmt((ornn.vida / dpsArm / (ornn.vida / xayah.dps) - 1) * 100, 0)}%. A simplificação da primeira conta não mudava quem vence, mas mudava bastante o tempo: depende da pergunta se ela é aceitável.</div>

<h3>3.3 Vida ou armadura para o Ornn? ${DADOS}${REGRA}</h3>
<p>Contra dano físico, compare a vida efetiva com ${esc(cota.nome)} (+${armCota} de armadura) e com ${esc(cinto.nome)} (+${vidaCinto} de vida):</p>
${md(String.raw`\text{sem item: } ${ornn.vida} \cdot ${n(1 + ornn.armadura / 100)} = ${n(ehpOrnn, 0)} \qquad \text{cota: } ${ornn.vida} \cdot ${n(1 + (ornn.armadura + armCota) / 100)} = ${n(ehpCota, 0)} \qquad \text{cinto: } ${ornn.vida + vidaCinto} \cdot ${n(1 + ornn.armadura / 100)} = ${n(ehpCinto, 0)}`)}
<p>Ponto de virada: a cota rende ${mi(String.raw`H \cdot ${armCota}/100`)}; o cinto rende ${mi(String.raw`${vidaCinto}\,(1 + A/100)`)}. A cota passa a valer mais quando</p>
${md(String.raw`H > \frac{${vidaCinto}\,(100 + A)}{${armCota}} = ${n(limiarVida, 0)}\ \text{(para } A = ${ornn.armadura})`)}
<div class="caixa resposta">Ornn com 1 estrela (${ornn.vida} de vida) ganha mais com o cinto. Um tanque com muita vida (2 ou 3 estrelas, ou com outros itens de vida) passa a ganhar mais com armadura. Regra de bolso: <b>reforce o que está em falta</b>; vida e armadura se multiplicam, e um produto cresce mais quando você aumenta o fator menor.</div>

<h3>3.4 Luvas ou arco? ${DADOS}${REGRA}${MODELO}</h3>
<p>${esc(luvas.nome)}: +${luvas.efeitos.CritChance}% de chance de crítico. ${esc(arco.nome)}: +${arco.efeitos.AS}% de velocidade de ataque.</p>
${md(String.raw`\text{luvas: } \frac{1 + ${n(pLuvas)} \cdot ${n(m - 1, 1)}}{1 + ${n(p)} \cdot ${n(m - 1, 1)}} = \frac{${n(multLuvas, 2)}}{${n(multCrit, 2)}} \approx 1 + ${n(ganhoLuvas * 100, 1)}\% \qquad \text{arco: } 1 + ${n(ganhoArco * 100, 0)}\%`)}
<div class="caixa resposta">Para um campeão sem outros itens, o arco aumenta mais o DPS de ataques básicos (${fmt(ganhoArco * 100, 0)}% contra ${fmt(ganhoLuvas * 100, 1)}%). Mas crítico também multiplica o dano de algumas habilidades, e velocidade de ataque enche a mana mais rápido: a conta certa depende do campeão. Boa pergunta para a turma: o que mudaria se o campeão já tivesse 60% de crítico?</div>

<h3>3.5 Guinsoo: velocidade de ataque que cresce com o tempo ${DADOS}${REGRA}${MODELO}</h3>
<p>${esc(guinsoo.nome)}: +${guinsoo.efeitos.AS}% de velocidade de ataque fixa e +${guinsoo.efeitos.AttackSpeedPerStack}% a mais a cada segundo de combate. Modelando o acúmulo como contínuo:</p>
${md(String.raw`v(t) = v_0\,\big(1 + ${n(asBaseG)} + ${n(asPorSeg)}\,t\big)`)}
<p>O número de ataques em ${T} s é a área sob ${mi("v(t)")}, ou seja, uma integral:</p>
${md(String.raw`N = \int_0^{${T}} v(t)\,dt = v_0\left(${n(1 + asBaseG)} \cdot ${T} + \frac{${n(asPorSeg)} \cdot ${T}^2}{2}\right) = ${n(xayah.vel)} \cdot ${n((1 + asBaseG) * T + (asPorSeg * T * T) / 2, 2)} \approx ${n(ataquesGuinsoo, 1)}\ \text{ataques}`)}
<div class="caixa resposta">Na Xayah, sem o item: ${fmt(ataquesSem, 1)} ataques em ${T} s; com o item: ~${fmt(ataquesGuinsoo, 1)}. O ganho aumenta com o tempo, com o termo em ${mi("t^2")}: o item é fraco em lutas curtas e forte em lutas longas. Como o jogo acumula de segundo em segundo, a conta “de verdade” é uma soma em degraus. Comparar a soma com a integral é uma soma de Riemann ao vivo.</div>

<h3>3.6 Quanto tempo o corpo a corpo leva para chegar na Ashe? ${DADOS}${MODELO}</h3>
<p>A Ashe tem alcance de ${fmt(ashe.alcanceUn, 0)} unidades; um corpo a corpo, ${fmt(ornn.alcanceUn, 0)}. Todos andam a ${fmt(ornn.movimento, 0)} unidades/s.</p>
${md(String.raw`t = \frac{\Delta x}{v} = \frac{${ashe.alcanceUn} - ${ornn.alcanceUn}}{${ornn.movimento}} = ${n(tempoAproximar, 2)}\ \mathrm{s} \qquad \text{ataques da Ashe nesse tempo} \approx ${n(ashe.vel)} \cdot ${n(tempoAproximar, 2)} \approx ${n(ataquesAshe, 1)}`)}
<div class="caixa resposta">É o melhor caso para o corpo a corpo (linha reta, sem colisão). Com outros campeões no caminho, o deslocamento é maior que a distância em linha reta, e a Ashe ganha mais tempo. Vetores de novo: deslocamento não é caminho.</div>

<h3>3.7 Habilidade em área: espalhar ou agrupar? ${HIPOTESE}${MODELO}</h3>
<p>Suponha uma habilidade inimiga que causa 300 de dano a cada alvo num círculo de 1 hex de raio (número inventado; use o tooltip do jogo para um caso real).</p>
${md(String.raw`\text{time agrupado: } N = 4 \Rightarrow 4 \cdot 300 = 1200 \qquad \text{time espalhado: } N = 1 \Rightarrow 300`)}
<div class="caixa resposta">O dano por alvo é o mesmo; o que muda é ${mi("N")}. Contra time com muito dano em área, espalhar reduz o dano total por um fator igual ao número de alvos poupados. Contra assassinos que pulam na retaguarda, o raciocínio inverte (seção 3.6).</div>

<h2>4. Medir no jogo (física experimental)</h2>
<ol>
<li>${MEDIR} <b>Mana por ataque:</b> conte quantos ataques um campeão sem itens leva para encher a mana. Com a mana inicial e a máxima da tabela, calcule ${mi("q")}.</li>
<li>${MEDIR} <b>Estrelas:</b> razão da vida e do dano entre 1 e 2 estrelas do mesmo campeão.</li>
<li>${MEDIR} <b>Armadura:</b> num modo de treino, compare o número de dano que aparece num alvo com armadura conhecida com o dano por ataque. A fórmula ${mi(String.raw`100/(100+A)`)} se confirma?</li>
<li>${MEDIR} <b>Tempo para derrubar:</b> cronometre um combate de 1 contra 1 e compare com a conta da seção 3.2. O que explica a diferença?</li>
</ol>

<h2 class="quebra">5. Tabela de campeões ${DADOS}</h2>
<p class="pequeno">Valores com 1 estrela, sem itens. DPS base = dano × velocidade. DPS com crítico = DPS × ${fmt(multCrit)} (valor esperado). Vida efetiva = vida × (1 + resistência/100). Planilha completa, com alcance em unidades e características: <code>campeoes.csv</code>.</p>
<table><tr><th>Campeão</th><th>$</th><th>Vida</th><th>Arm.</th><th>RM</th><th>Dano</th><th>Vel.</th><th>DPS</th><th>DPS c/ crít.</th><th>Vida ef. físico</th><th>Vida ef. mágico</th><th>Alc.</th><th>Mana ini./máx.</th></tr>${linhasCampeoes}</table>

<h2 class="quebra">6. Habilidades ${DADOS}</h2>
<p class="pequeno">Texto do jogo; ▢ marca um valor que não vem nos arquivos públicos (leia no tooltip). Tipo de dano e área foram detectados por palavras no texto: confirme antes de afirmar em aula.</p>
<table class="texto"><tr><th>Campeão</th><th>Dano</th><th>Área</th><th>Descrição</th></tr>${linhasHabilidades}</table>

<h2 class="quebra">7. Itens ${DADOS}</h2>
<p class="pequeno">Lista de itens padrão dos arquivos do jogo; nem todos estão necessariamente ativos no set ${SET}. Ordem: componentes, itens completos (com receita) e especiais (suporte, artefatos e outros sem receita). Dano de Ataque é porcentagem do dano base do campeão.</p>
<table class="texto"><tr><th>Item</th><th>Receita</th><th>Atributos</th><th>Efeito</th></tr>${linhasItens}</table>

<h2>8. Fontes e limites</h2>
<ul>
<li>${esc(fonte)} Arquivos: <code>cdragon/tft/pt_br.json</code> e <code>game/characters/&lt;campeão&gt;.cdtb.bin.json</code>.</li>
<li>Os arquivos não trazem: mana por ataque, multiplicadores de estrela, os números da maior parte das habilidades e o efeito de “Precisão”. Tudo que depende disso está marcado ${REGRA}, ${MEDIR} ou ${HIPOTESE}.</li>
<li>O jogo muda a cada atualização. Para atualizar: <code>node materiais/aula-tft/gerar.mjs</code> (apague a pasta <code>.cache</code> antes para baixar de novo).</li>
</ul>
</body></html>`

gerarPdf("guia-professor-tft", html)

console.log(`Campeões: ${campeoes.length}, itens: ${itens.length}, habilidades com sinal de área: ${comArea.length}`)
console.log(`Gerado em ${saida}`)
