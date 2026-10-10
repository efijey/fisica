// Gera a parte 2 da aula: "Como melhorar o seu early game no TFT".
// Uso: node materiais/aula-tft/gerar-early-game.mjs  (TFT_SET=18 por padrão)
import {
  BASE, DADOS, HIPOTESE, MEDIR, MODELO, REGRA, SET,
  baixar, esc, estilo, fmt, gerarPdf, legendaEtiquetas, md, mi, n, versaoDoJogo,
} from "./comum.mjs"

const dados = baixar(`${BASE}/cdragon/tft/pt_br.json`, "pt_br.json")
const mapa = baixar(`${BASE}/game/data/maps/shipping/map22/map22.bin.json`, "map22.json")
const versao = versaoDoJogo()
const baixadoEm = new Date().toISOString().slice(0, 10)
const fonte = `CommunityDragon (dados extraídos dos arquivos do jogo; não oficial). Set ${SET}, versão ${versao}, baixado em ${baixadoEm}.`

// ---------- dados do jogo ----------
const set = mapa[`Maps/Shipping/Map22/Sets/TFTSet${SET}`]
const chancesLoja = mapa[set.DropRateTables.Shop].mDropRatesByLevel.map((nivel) => Object.values(nivel).find(Array.isArray))
const estagios = mapa[set.StageRoundData].stages.map((e) => e.mRounds.map((r) => r.split("/").pop()))
const pvpPorEstagio = estagios.map((rodadas) => rodadas.filter((r) => r === "TFT_Round_Combat").length)
const rodadaCombate = mapa["Maps/Shipping/Map22/Rounds/TFT_Round_Combat"]
const duracaoPlanejamento = rodadaCombate.mPlanning.mDuration
const duracaoCombate = rodadaCombate.mCombat.mDuration

// Tabela de dano por estágio que bate com o modo padrão; o set não a referencia por nome.
const tabelaDano = Object.values(mapa).find(
  (o) => o?.mConstants?.PlayerDamageStage3?.mValue === 6 && o.mConstants.PlayerDamageStage2?.mValue === 2,
).mConstants
const danoEstagio = (e) => tabelaDano[`PlayerDamageStage${e}`]?.mValue ?? 0

const campeao = (nome) => {
  const c = dados.sets[SET].champions.find((x) => x.name === nome && x.traits.length)
  return { nome, vida: c.stats.hp, armadura: c.stats.armor, dano: c.stats.damage, vel: c.stats.attackSpeed }
}
const xayah = campeao("Xayah")
const caitlyn = campeao("Caitlyn")
const ornn = campeao("Ornn")

// ---------- regras (não vêm nos arquivos; conferir no jogo) ----------
const VIDA_INICIAL = 100
const RENDA_BASE = 5
const JUROS_POR = 10
const JUROS_MAX = 5
const OURO_VITORIA = 1
const bonusSequencia = (s) => (s >= 6 ? 3 : s === 5 ? 2 : s >= 3 ? 1 : 0)
const XP_POR_COMPRA = 4
const CUSTO_COMPRA_XP = 4
const XP_PASSIVO = 2
const xpParaSubir = { 3: 6, 4: 10, 5: 20, 6: 36, 7: 48, 8: 76, 9: 84 }
const juros = (g) => Math.min(Math.floor(g / JUROS_POR), JUROS_MAX)
const DANO_POR_INIMIGO_VIVO = 1
const MULT_ESTRELA = { vida: [1, 1.8, 3.24], dano: [1, 1.5, 2.25] }
const FONTE_DANO_UNIDADE = "https://teamfighttactics.leagueoflegends.com/en-us/news/game-updates/teamfight-tactics-patch-14-8-notes/"
const FONTE_ESTRELAS = "https://wiki.leagueoflegends.com/en-us/TFT:Champion"

// ---------- 1. sequências ----------
const inimigosVivosHip = { 2: 3, 3: 5, 4: 6 }
const danoDerrota = (estagio) => danoEstagio(estagio) + DANO_POR_INIMIGO_VIVO * inimigosVivosHip[estagio]
function simularSequencia(resultados) {
  let s = 0
  let ouro = 0
  let vida = 0
  const porEstagio = pvpPorEstagio[1]
  ;[...resultados].forEach((r, i) => {
    const estagio = i < porEstagio ? 2 : 3
    if (r === "V") {
      s = s > 0 ? s + 1 : 1
      ouro += OURO_VITORIA
    } else {
      s = s < 0 ? s - 1 : -1
      vida += danoDerrota(estagio)
    }
    ouro += bonusSequencia(Math.abs(s))
  })
  return { ouro, vida }
}
const totalPvp = pvpPorEstagio[1] + pvpPorEstagio[2]
const cenarios = [
  ["Vence tudo", "V".repeat(totalPvp)],
  ["Perde tudo", "D".repeat(totalPvp)],
  ["Perde o estágio 2, vence o 3", "D".repeat(pvpPorEstagio[1]) + "V".repeat(pvpPorEstagio[2])],
  ["Vence o estágio 2, perde o 3", "V".repeat(pvpPorEstagio[1]) + "D".repeat(pvpPorEstagio[2])],
  ["Sequências quebradas", "VVDVVDVVDV".slice(0, totalPvp)],
  ["Alterna vitória e derrota", "VD".repeat(totalPvp / 2)],
].map(([nome, r]) => ({ nome, r, ...simularSequencia(r) }))
const perde = cenarios.find((c) => c.nome === "Perde tudo")
const alterna = cenarios.find((c) => c.nome === "Alterna vitória e derrota")
const perdeCedo = cenarios.find((c) => c.nome === "Perde o estágio 2, vence o 3")
const taxaCambio = (perde.ouro - perdeCedo.ouro) / (perde.vida - perdeCedo.vida)

// ---------- 2. orçamento de vida ----------
const danoEst2 = pvpPorEstagio[1] * danoEstagio(2)
const danoEst3 = pvpPorEstagio[2] * danoEstagio(3)
const vidaDepoisPerdeTudo = VIDA_INICIAL - perde.vida
const danoPorDerrotaEst4Hip = danoDerrota(4)
const derrotasRestantes = vidaDepoisPerdeTudo / danoPorDerrotaEst4Hip

// ---------- 3. economia ----------
const rodadasEconomia = estagios[1].length + estagios[2].length
const ouroInicialHip = 10
function simularEconomia(alvo) {
  let g = ouroInicialHip
  let gasto = 0
  let jurosTotal = 0
  let gastoAteFimEst2 = 0
  for (let r = 0; r < rodadasEconomia; r++) {
    const j = juros(g)
    jurosTotal += j
    g += RENDA_BASE + j
    const gastar = Math.max(0, g - alvo)
    gasto += gastar
    g -= gastar
    if (r === estagios[1].length - 1) gastoAteFimEst2 = gasto
  }
  return { alvo, gasto, banco: g, total: gasto + g, juros: jurosTotal, gastoAteFimEst2 }
}
const economias = [0, 20, 30, 50].map(simularEconomia)
const eco0 = economias[0]
const eco50 = economias[3]
const tempoAte50 = JUROS_POR * Math.log((50 + JUROS_POR * RENDA_BASE) / (ouroInicialHip + JUROS_POR * RENDA_BASE))

// ---------- 4. nível e itens ----------
const pAoMenosUm = (p) => 1 - (1 - p) ** 5
const linhasLoja = [3, 4, 5, 6, 7]
  .map((nivel) => {
    const c = chancesLoja[nivel - 1]
    return `<tr><td>${nivel}</td>${c.map((p) => `<td>${fmt(p * 100, 0)}%</td>`).join("")}<td>${fmt(5 * c[2], 2)}</td><td>${fmt(pAoMenosUm(c[2]) * 100, 0)}%</td><td>${fmt(pAoMenosUm(c[3]) * 100, 0)}%</td></tr>`
  })
  .join("")
const custoXp = (xp) => CUSTO_COMPRA_XP * Math.ceil(xp / XP_POR_COMPRA)

const slamAgora = { ganho: 30, rodadas: 10 }
const esperar = { ganho: 36, rodadas: 7 }
const areaSlam = slamAgora.ganho * slamAgora.rodadas
const areaEsperar = esperar.ganho * esperar.rodadas
const melhoraNecessaria = slamAgora.rodadas / esperar.rodadas - 1

// ---------- 5. duelos (Lanchester) ----------
const forca = (N, mult = 1) => mult * N * N
const sobreviventes = (A, B) => Math.sqrt(A * A - B * B)
const multItensHip = 1.2 * 1.15

// ---------- 6. foco ou espalhar ----------
const dpsContra = (c, alvo) => c.dano * (100 / (100 + alvo.armadura)) * c.vel
const dX = dpsContra(xayah, ornn)
const dC = dpsContra(caitlyn, ornn)
const dpsOrnn = ornn.dano * ornn.vel
const H = ornn.vida
const t1Foco = H / (dX + dC)
const tFimFoco = (2 * H) / (dX + dC)
const danoRecebidoFoco = dpsOrnn * (2 * t1Foco + (tFimFoco - t1Foco))
const tPrimeiroEsp = Math.min(H / dX, H / dC)
const rapido = H / dX < H / dC ? "Xayah" : "Caitlyn"
const restante = H - Math.min(dX, dC) * tPrimeiroEsp
const tFimEsp = tPrimeiroEsp + restante / (dX + dC)
const danoRecebidoEsp = dpsOrnn * (2 * tPrimeiroEsp + (tFimEsp - tPrimeiroEsp))
const reducaoFoco = 1 - danoRecebidoFoco / danoRecebidoEsp

// ---------- html ----------
const linhasCenarios = cenarios
  .map((c) => `<tr><td class="nome">${c.nome}</td><td class="nome"><code>${c.r}</code></td><td>${c.ouro}</td><td>${c.vida}</td></tr>`)
  .join("")
const linhasEconomia = economias
  .map((e) => `<tr><td>${e.alvo === 0 ? "gasta tudo" : `mantém ${e.alvo}`}</td><td>${e.gastoAteFimEst2}</td><td>${e.gasto}</td><td>${e.banco}</td><td>${e.total}</td><td>${e.juros}</td></tr>`)
  .join("")

const regrasUsadas = `<div class="caixa curta"><b>Regras usadas neste material ${REGRA} — conferir no jogo antes da aula</b>
<ul>
<li>Vida inicial do jogador: ${VIDA_INICIAL}.</li>
<li>Renda base: ${RENDA_BASE} de ouro por rodada (a partir do estágio 2). Vitória contra jogador: +${OURO_VITORIA}.</li>
<li>Juros: +1 de ouro para cada ${JUROS_POR} guardados, até +${JUROS_MAX} (com ${JUROS_POR * JUROS_MAX} ou mais).</li>
<li>Bônus de sequência (vitórias ou derrotas seguidas): 3–4 seguidas = +1; 5 = +2; 6 ou mais = +3. Rodadas contra monstros e carrossel não quebram a sequência.</li>
<li>XP: ${CUSTO_COMPRA_XP} de ouro compram ${XP_POR_COMPRA} XP; +${XP_PASSIVO} XP por rodada. XP para subir: ${Object.entries(xpParaSubir).map(([de, xp]) => `${de}→${Number(de) + 1}: ${xp}`).join("; ")}.</li>
<li>Número de peças em campo = nível do jogador.</li>
<li>Ao perder, o dano ao jogador é o dano do estágio ${DADOS} mais ${DANO_POR_INIMIGO_VIVO} por unidade inimiga viva, sem importar custo ou estrelas (regra oficial desde a atualização 14.8: <a href="${FONTE_DANO_UNIDADE}">notas da Riot</a>; guias do set ${SET} confirmam).</li>
<li>As unidades atacam, em geral, o inimigo mais próximo.</li>
</ul></div>`

const html = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<title>Early game no TFT — parte 2</title>
${estilo}</head><body>

<h1>Como melhorar o seu early game no TFT</h1>
<div class="sub">Parte 2 da aula — material de apoio do professor. Não é sobre qual campeão é melhor: é sobre <b>como avaliar</b> uma situação com contas.</div>
<p class="pequeno">${esc(fonte)}</p>

${legendaEtiquetas}
${regrasUsadas}

<h2>Roteiro da parte 2 (cerca de 45 minutos)</h2>
<div class="caixa aula"><b>Ponte com a parte 1 (2 min).</b> Na parte 1, a pergunta era “quanto tempo o Ornn aguenta?”: vida ÷ dano por segundo. Agora a pergunta é a mesma, só que o Ornn é <b>você</b>: a sua vida de jogador é um orçamento, e o lobby é quem causa dano.</div>
<div class="caixa aula"><b>Bloco 1 — Sequência de vitórias ou de derrotas? (8 min)</b> Votação antes da conta. Seção 1.</div>
<div class="caixa aula"><b>Bloco 2 — Quanto dano você pode tomar? (6 min)</b> Seção 2.</div>
<div class="caixa aula"><b>Bloco 3 — Economia e juros (8 min).</b> O juro de 10% por rodada e por que ele “satura”. Seção 3.</div>
<div class="caixa aula"><b>Bloco 4 — Decisões de maior impacto: subir de nível e montar item (8 min).</b> Seção 4.</div>
<div class="caixa aula"><b>Bloco 5 — Avaliar um duelo (8 min).</b> Mesmo nível, nível abaixo, com e sem itens: a lei de Lanchester. Seção 5.</div>
<div class="caixa aula"><b>Bloco 6 — Concentrar ou espalhar o dano? (5 min)</b> A área sob a curva. Seção 6.</div>

<h2 class="quebra">1. O que é melhor: sequência de vitórias ou de derrotas?</h2>
<div class="caixa resposta"><b>Resposta curta.</b> Vencer em sequência é o melhor (ouro + vida). Perder em sequência só compensa <b>cedo</b> (estágio 2, quando a derrota é barata) e <b>junto com economia</b>: o bônus sozinho paga pouco. Levar a sequência de derrotas até o fim do estágio 3 custa vida demais. O pior caso é alternar vitória e derrota: perde vida e não ganha bônus.</div>
<p>${DADOS} Os estágios 2 e 3 têm ${pvpPorEstagio[1]} combates contra jogadores cada (mais um carrossel e uma rodada de monstros). ${REGRA}${HIPOTESE} Simulação dos ${totalPvp} combates, contando só o ouro que <b>muda</b> entre os cenários (vitórias + bônus de sequência) e a vida perdida. Cada derrota custa o dano do estágio mais ${DANO_POR_INIMIGO_VIVO} por inimigo vivo; supusemos ${inimigosVivosHip[2]} inimigos vivos por derrota no estágio 2 e ${inimigosVivosHip[3]} no estágio 3.</p>
<table><tr><th>Cenário</th><th>Resultados (V/D)</th><th>Ouro extra</th><th>Vida perdida</th></tr>${linhasCenarios}</table>
<p><b>Leitura da tabela:</b> “perde o estágio 2, vence o 3” tem <b>mais ouro e menos vida perdida</b> do que alternar (${perdeCedo.ouro} contra ${alterna.ouro} de ouro; ${perdeCedo.vida} contra ${alterna.vida} de vida). Ele é melhor nas duas coisas ao mesmo tempo. Já estender as derrotas pelo estágio 3 (“perde tudo”) troca vida por ouro a uma taxa ruim:</p>
${md(String.raw`\frac{\Delta\,\text{ouro}}{\Delta\,\text{vida}} = \frac{${perde.ouro} - ${perdeCedo.ouro}}{${perde.vida} - ${perdeCedo.vida}} \approx ${n(taxaCambio, 2)}\ \frac{\text{ouro}}{\text{ponto de vida}}`)}
<p><b>Ligação com a física:</b> é uma <b>taxa de câmbio</b>, uma razão entre duas grandezas diferentes, como velocidade (metros por segundo). A decisão vira: “quanto ouro eu aceito por ponto de vida?”. No estágio 3, cada derrota custa ${danoEstagio(3)} de dano fixo contra ${danoEstagio(2)} no estágio 2 (seção 2): a mesma troca fica três vezes mais cara.</p>
<p><b>Então por que tanta gente perde em sequência de propósito?</b> Porque o ganho de verdade não é o bônus: quem aceita perder não gasta ouro no time e chega mais rápido aos juros (seção 3: até ${eco50.total - eco0.total} de ouro a mais nos estágios 2 e 3). ${REGRA} Além disso, quem tem menos vida escolhe primeiro no carrossel.</p>
<p><b>Repare na forma da tabela:</b> os extremos ganham bônus; o meio (alternar) não ganha. É uma função com um “vale” no meio. Por isso a decisão certa costuma ser <b>escolher um lado cedo</b>.</p>
<div class="caixa"><b>Como avaliar na partida</b><ol>
<li>Meu time atual vence a maioria dos adversários? Se sim, fortaleça e mantenha a sequência de vitórias.</li>
<li>Se não, ainda estou no estágio 2? Perder agora é barato; combine com guardar ouro e planeje estabilizar no começo do estágio 3.</li>
<li>Se estou alternando, é o pior lugar: decida para um lado.</li>
</ol></div>

<h2 class="quebra">2. Quanto dano você pode tomar no total?</h2>
<div class="caixa resposta"><b>Resposta curta.</b> Você começa com ${VIDA_INICIAL}. Perder o estágio 2 inteiro custa ~${perdeCedo.vida} no nosso exemplo, um quarto da vida. Perder <b>todos</b> os combates dos estágios 2 e 3 custa ${danoEst2 + danoEst3} só de dano fixo e ~${perde.vida} somando os inimigos vivos: sobram ~${vidaDepoisPerdeTudo}, que no estágio 4 valem só umas ${fmt(derrotasRestantes, 1)} derrotas.</div>
${md(String.raw`\text{dano de uma derrota} = \text{dano do estágio} + ${DANO_POR_INIMIGO_VIVO} \times (\text{inimigos vivos})`)}
<p>${DADOS} Dano do estágio, por derrota (encontrado nos arquivos; a tabela bate com o modo padrão, mas o set não aponta para ela por nome):</p>
<table><tr><th>Estágio</th>${[2, 3, 4, 5, 6, 7].map((e) => `<td>${e}</td>`).join("")}</tr><tr><th>Dano do estágio</th>${[2, 3, 4, 5, 6, 7].map((e) => `<td>${danoEstagio(e)}</td>`).join("")}</tr></table>
<p class="pequeno">${REGRA} Fontes externas divergem nos estágios 3 e 4: o tft-boost (atualização 18.1) traz a mesma tabela dos arquivos; OP.GG e TFT Ninja trazem 5 e 8. Para tirar a dúvida, perca uma rodada no estágio 3 e subtraia do dano recebido o número de inimigos vivos.</p>
<p>${MODELO}${HIPOTESE} Quantas derrotas ainda cabem? É a mesma conta do “tempo para derrubar o Ornn” da parte 1. Com ${inimigosVivosHip[4]} inimigos vivos por derrota no estágio 4:</p>
${md(String.raw`\text{derrotas restantes} = \frac{\text{vida}}{\text{dano por derrota}} = \frac{${vidaDepoisPerdeTudo}}{${danoEstagio(4)} + ${inimigosVivosHip[4]}} \approx ${n(derrotasRestantes, 1)}`)}
<p>Compare com quem perdeu só o estágio 2: ${mi(String.raw`\frac{${VIDA_INICIAL - perdeCedo.vida}}{${danoEstagio(4)} + ${inimigosVivosHip[4]}} \approx ${n((VIDA_INICIAL - perdeCedo.vida) / danoPorDerrotaEst4Hip, 1)}`)} derrotas ainda cabem no estágio 4. A diferença entre as duas estratégias é ${mi(String.raw`\approx ${n((VIDA_INICIAL - perdeCedo.vida) / danoPorDerrotaEst4Hip - derrotasRestantes, 0)}`)} derrotas de margem.</p>
<p><b>Ligação com a física:</b> o dano de uma derrota é uma função afim, ${mi("y = a + bN")}: um termo fixo (o estágio) e um termo proporcional ao número ${mi("N")} de inimigos vivos, com inclinação ${mi(String.raw`b = ${DANO_POR_INIMIGO_VIVO}`)}. Como na posição ${mi(String.raw`x = x_0 + vt`)} do movimento uniforme.</p>
<p><b>E o termo fixo cresce com o tempo:</b> ${danoEstagio(2)} no estágio 2, ${danoEstagio(3)} no 3, ${danoEstagio(4)} no 4. É como uma taxa que aumenta: a mesma vida “compra” cada vez menos derrotas. Por isso perder é barato cedo e caro depois.</p>
<div class="caixa"><b>Como avaliar na partida</b><ol>
<li>Divida a sua vida pelo dano típico de uma derrota no estágio atual: isso é o número de “vidas” que você ainda tem.</li>
<li>Se esse número é menor que 3, a prioridade é estabilizar (gastar ouro para vencer), não economizar.</li>
</ol></div>

<h2 class="quebra">3. Quanto a economia impacta? Qual o custo e o benefício dos juros?</h2>
<div class="caixa resposta"><b>Resposta curta.</b> Juros são um rendimento de 10% por rodada sobre o que você guarda, até o teto. Guardar até ${JUROS_POR * JUROS_MAX} rende, nos estágios 2 e 3, ~${eco50.total - eco0.total} de ouro a mais do que gastar tudo, mas você gasta <b>bem menos cedo</b>, e por isso o time fica mais fraco agora.</div>
<p>${DADOS}${REGRA}${HIPOTESE} Simulação das ${rodadasEconomia} rodadas dos estágios 2 e 3, começando com ${ouroInicialHip} de ouro, sem contar vitórias nem bônus de sequência. Cada estratégia gasta tudo o que passa do alvo:</p>
<table><tr><th>Estratégia</th><th>Gasto até o fim do estágio 2</th><th>Gasto total</th><th>No banco no fim</th><th>Total (gasto + banco)</th><th>Juros recebidos</th></tr>${linhasEconomia}</table>
<p><b>O custo e o benefício:</b> “mantém ${JUROS_POR * JUROS_MAX}” termina com mais ouro no total, mas gasta muito menos no estágio 2. Cada 10 de ouro que você gasta abaixo de ${JUROS_POR * JUROS_MAX} custa 1 de ouro <b>por rodada</b> até você repor. Gastar só compensa se esse ouro te fizer vencer rodadas (ouro de vitória, bônus e vida poupada).</p>
<p>${MODELO} <b>Ligação com a física e o cálculo:</b> abaixo do teto, o ouro cresce com uma taxa que depende do próprio ouro:</p>
${md(String.raw`\frac{dg}{dt} = ${RENDA_BASE} + \frac{g}{${JUROS_POR}} \quad\Longrightarrow\quad g(t) = (g_0 + ${JUROS_POR * RENDA_BASE})\,e^{t/${JUROS_POR}} - ${JUROS_POR * RENDA_BASE}`)}
<p>É crescimento exponencial (como juros compostos, ou uma população). Começando com ${ouroInicialHip}, o modelo contínuo leva ${mi(String.raw`t = ${JUROS_POR}\ln\frac{${50 + JUROS_POR * RENDA_BASE}}{${ouroInicialHip + JUROS_POR * RENDA_BASE}} \approx ${n(tempoAte50, 1)}`)} rodadas para chegar a 50. Depois do teto, a taxa fica constante (${RENDA_BASE + JUROS_MAX} por rodada): a curva <b>satura</b>, como a velocidade terminal de um objeto em queda. Por isso guardar acima de ${JUROS_POR * JUROS_MAX} não rende nada a mais.</p>
<p class="pequeno">O jogo arredonda os juros para baixo (49 de ouro rende 4, não 4,9). A simulação da tabela usa o arredondamento; o modelo contínuo não. Comparar os dois é um bom exercício.</p>
<div class="caixa"><b>Como avaliar na partida</b><ol>
<li>Estou a poucos de ouro de um múltiplo de 10? Às vezes vale esperar uma rodada para não perder 1 de juro.</li>
<li>O ouro gasto agora muda o resultado do próximo combate? Se não muda, guarde.</li>
<li>Estou com pouca vida (seção 2)? Então o juro vale menos que a vida: gaste.</li>
</ol></div>

<h2 class="quebra">4. Quais são as decisões de maior impacto no early game?</h2>
<div class="caixa resposta"><b>Resposta curta.</b> Duas: <b>quantas peças você tem em campo</b> (nível) e <b>se seus itens estão sendo usados</b> (montar o item agora em vez de guardar componentes). Uma peça a mais muda a força do time ao quadrado (seção 5); um item no banco tem dano por segundo zero.</div>
<h3>4.1 Subir para o nível 4, 5 ou 6</h3>
<p>${REGRA} Cada nível é uma peça a mais em campo. Custo em ouro (sem contar o XP de cada rodada): do 4 para o 5, ${xpParaSubir[4]} XP = ${custoXp(xpParaSubir[4])} de ouro; do 5 para o 6, ${xpParaSubir[5]} XP = ${custoXp(xpParaSubir[5])} de ouro.</p>
<p>${DADOS} O nível também muda as chances da loja. Chance de cada custo aparecer em cada vaga da loja (5 vagas):</p>
<table><tr><th>Nível</th><th>Custo 1</th><th>Custo 2</th><th>Custo 3</th><th>Custo 4</th><th>Custo 5</th><th>Peças de custo 3 por loja (média)</th><th>Loja com pelo menos 1 de custo 3</th><th>Loja com pelo menos 1 de custo 4</th></tr>${linhasLoja}</table>
${md(String.raw`P(\text{pelo menos 1}) = 1 - (1 - p)^5`)}
<p><b>Ligação com a física:</b> valor esperado e probabilidade, como no crítico da parte 1. Média de peças de custo 3 por loja = ${mi(String.raw`5 \cdot p`)}.</p>
<h3>4.2 Montar o item agora ou esperar o item ideal?</h3>
<p>${MODELO}${HIPOTESE} Pense no benefício do item como uma <b>área</b>: ganho por rodada × número de rodadas em que ele está em campo. Suponha que montar agora dê +${slamAgora.ganho}% de força por ${slamAgora.rodadas} rodadas, e que esperar 3 rodadas dê um item melhor, +${esperar.ganho}%, por ${esperar.rodadas} rodadas:</p>
${md(String.raw`\text{agora: } ${slamAgora.ganho} \cdot ${slamAgora.rodadas} = ${areaSlam} \qquad \text{esperar: } ${esperar.ganho} \cdot ${esperar.rodadas} = ${areaEsperar}`)}
<p>Esperar só compensa se o item ideal for pelo menos ${mi(String.raw`${slamAgora.rodadas}/${esperar.rodadas} - 1 \approx ${n(melhoraNecessaria * 100, 0)}\%`)} melhor. Raramente é. E isso sem contar as vitórias (ouro, sequência, vida) que o item rende nas rodadas de espera.</p>
<p><b>Ligação com a física:</b> é uma integral no tempo, a mesma ideia da Lâmina da Fúria de Guinsoo na parte 1: o que importa é a área sob a curva, não só a altura.</p>
<div class="caixa"><b>Como avaliar na partida</b><ol>
<li>Tenho componentes parados no banco? Cada rodada parado é área perdida.</li>
<li>Subir de nível agora me dá uma peça que muda o próximo combate? Se o banco tem uma peça boa esperando vaga, sim.</li>
<li>Depois de subir, ainda fico perto de um múltiplo de 10 de ouro (seção 3)?</li>
</ol></div>

<h2 class="quebra">5. Como avaliar um duelo: mesmo nível, nível abaixo, com e sem item</h2>
<div class="caixa resposta"><b>Resposta curta.</b> A força de um time cresce com o <b>quadrado</b> do número de peças e só <b>linearmente</b> com a qualidade de cada uma. Uma peça a mais (um nível acima) costuma valer mais do que um ou dois itens no early game.</div>
<p>${MODELO} A <b>lei quadrática de Lanchester</b> (1916) modela dois exércitos em que todos atiram em todos. Se ${mi("A")} e ${mi("B")} são os números de unidades vivas e ${mi(String.raw`\alpha, \beta`)} a eficácia de cada unidade:</p>
${md(String.raw`\frac{dA}{dt} = -\beta B, \qquad \frac{dB}{dt} = -\alpha A \quad\Longrightarrow\quad \alpha A^2 - \beta B^2 = \text{constante}`)}
<p>Vence quem tem o maior ${mi(String.raw`\alpha N^2`)}. Usando a parte 1, a eficácia de uma unidade é proporcional a <b>dano por segundo × vida efetiva</b>. Isso dá uma regra de bolso:</p>
${md(String.raw`\text{força} \propto \text{DPS} \times \text{vida efetiva} \times N^2`)}
<table><tr><th>Situação</th><th>Conta</th><th>Quem vence</th></tr>
<tr><td class="nome">Mesmo nível (5 contra 5), sem itens</td><td>${mi("25")} contra ${mi("25")}</td><td class="nome">Empate: decidem estrelas, características e posicionamento.</td></tr>
<tr><td class="nome">Um nível acima (5 contra 4), sem itens</td><td>${mi(String.raw`5^2 = 25`)} contra ${mi(String.raw`4^2 = 16`)}</td><td class="nome">O de 5, com ${mi(String.raw`\sqrt{25 - 16} = ${n(sobreviventes(5, 4), 0)}`)} peças vivas no fim.</td></tr>
<tr><td class="nome">Nível abaixo com itens ${HIPOTESE}: 4 peças com +20% de DPS e +15% de vida efetiva contra 5 sem itens</td><td>${mi(String.raw`${n(multItensHip, 2)} \cdot 16 \approx ${n(forca(4, multItensHip), 1)}`)} contra ${mi("25")}</td><td class="nome">O de 5, por pouco.</td></tr>
<tr><td class="nome">Quanto de item o nível abaixo precisa?</td><td>${mi(String.raw`x \cdot 16 = 25 \Rightarrow x = ${n(25 / 16, 2)}`)}</td><td class="nome">Itens que multipliquem o time por ~${fmt((25 / 16 - 1) * 100, 0)}%.</td></tr>
</table>
<p><b>E o dano no jogador?</b> Cada peça que sobra viva causa ${DANO_POR_INIMIGO_VIVO} de dano a mais (seção 2). Vencer 5 contra 4 deixa ~${fmt(sobreviventes(5, 4), 0)} vivas; vencer 5 contra 5 por pouco deixa quase nenhuma. Ou seja: perder <b>apertado</b> custa só o dano do estágio, perder “de lavada” custa até ${mi("+5")} a mais.</p>
<p class="pequeno">Limites do modelo: no TFT nem todos atacam todos (há linha de frente e de trás), habilidades em área e controle de grupo mudam a conta, e as peças não são iguais. Lanchester é uma primeira aproximação, boa para decidir “subo de nível ou não”, não para prever cada luta.</p>
<div class="caixa"><b>Como avaliar na partida</b><ol>
<li>Conte as peças: estou acima, igual ou abaixo do adversário?</li>
<li>Se estou abaixo, meus itens compensam ~${fmt((25 / 16 - 1) * 100, 0)}% (4 contra 5)? Se não, subir de nível é a jogada.</li>
<li>Peças de 2 estrelas contam como “mais força por peça”: vida ×${fmt(MULT_ESTRELA.vida[1], 1)} e dano de ataque ×${fmt(MULT_ESTRELA.dano[1], 1)} (<a href="${FONTE_ESTRELAS}">Wiki do LoL</a>), então DPS × vida sobe ${mi(String.raw`${n(MULT_ESTRELA.vida[1], 1)} \cdot ${n(MULT_ESTRELA.dano[1], 1)} = ${n(MULT_ESTRELA.vida[1] * MULT_ESTRELA.dano[1], 1)}`)} vezes ocupando a mesma vaga. ${MEDIR} Confira no jogo; a habilidade sobe por uma tabela própria de cada campeão.</li>
</ol></div>

<h2 class="quebra">6. Posicionamento: concentrar o dano ou espalhar?</h2>
<div class="caixa resposta"><b>Resposta curta.</b> Contra a linha de frente, <b>concentrar</b> é melhor: as duas carries terminam a luta no mesmo tempo total, mas o primeiro inimigo cai antes e para de causar dano mais cedo. Você toma menos dano no total.</div>
<p>${DADOS}${REGRA}${MODELO} Xayah e Caitlyn contra dois Ornns (${H} de vida, ${ornn.armadura} de armadura cada). Com a armadura, a Xayah causa ${mi(String.raw`${n(dX, 1)}`)} de dano por segundo no Ornn e a Caitlyn ${mi(String.raw`${n(dC, 1)}`)}. Cada Ornn causa ${mi(String.raw`${n(dpsOrnn, 1)}`)} por segundo enquanto está vivo.</p>
<h3>Concentrando: as duas carries no mesmo Ornn, depois no outro</h3>
${md(String.raw`t_1 = \frac{${H}}{${n(dX, 1)} + ${n(dC, 1)}} \approx ${n(t1Foco, 1)}\ \mathrm{s} \qquad t_{\text{fim}} = \frac{2 \cdot ${H}}{${n(dX + dC, 1)}} \approx ${n(tFimFoco, 1)}\ \mathrm{s}`)}
<h3>Espalhando: cada carry num Ornn</h3>
<p>A ${rapido} derruba o dela primeiro, em ${mi(String.raw`${n(tPrimeiroEsp, 1)}\ \mathrm{s}`)}; depois as duas acabam com o outro. Fim em ${mi(String.raw`${n(tFimEsp, 1)}\ \mathrm{s}`)}, o mesmo tempo.</p>
<p><b>O tempo total é igual</b> porque o dano total necessário (${2 * H}) e o dano por segundo total são os mesmos: é uma conservação. O que muda é <b>quanto tempo cada Ornn fica vivo</b>. Dano recebido = área sob a curva “Ornns vivos × dano por segundo”:</p>
${md(String.raw`\text{concentrando: } ${n(dpsOrnn, 1)}\,(2 \cdot ${n(t1Foco, 1)} + ${n(tFimFoco - t1Foco, 1)}) \approx ${n(danoRecebidoFoco, 0)} \qquad \text{espalhando: } ${n(dpsOrnn, 1)}\,(2 \cdot ${n(tPrimeiroEsp, 1)} + ${n(tFimEsp - tPrimeiroEsp, 1)}) \approx ${n(danoRecebidoEsp, 0)}`)}
<div class="caixa resposta">Concentrar reduz em ~${fmt(reducaoFoco * 100, 0)}% o dano que a sua linha de frente recebe, com o mesmo tempo total de luta. ${DADOS} O combate dura até ${duracaoCombate} s: esta luta leva ~${fmt(tFimFoco, 0)} s, quase o combate inteiro, então qualquer segundo de vantagem conta.</div>
<p><b>Quando espalhar é melhor:</b> quando o dano extra seria desperdiçado (dois atiradores num alvo quase morto, o chamado “overkill”), quando o inimigo tem habilidade em área que pune peças juntas (parte 1, seção 3.7) ou quando cada inimigo tem um escudo que absorve o primeiro golpe.</p>
<p>${REGRA} <b>Como forçar o foco:</b> você não escolhe o alvo; as unidades atacam o mais próximo. Para concentrar, coloque as carries do mesmo lado, de modo que o inimigo mais próximo seja o mesmo para as duas.</p>
<p><b>Ligação com a física:</b> integral no tempo (área sob a curva) e conservação (o total não muda, a distribuição muda).</p>

<h2 class="quebra">7. Resumo: pergunta do jogo e ferramenta de física</h2>
<table class="texto"><tr><th>Pergunta</th><th>Ferramenta</th><th>Na parte 1</th></tr>
<tr><td>Sequência de vitórias ou derrotas?</td><td>Razão entre grandezas (ouro por ponto de vida)</td><td>DPS como taxa</td></tr>
<tr><td>Quanto dano posso tomar?</td><td>Orçamento ÷ taxa</td><td>Tempo para derrubar = vida ÷ DPS</td></tr>
<tr><td>Economia e juros</td><td>Crescimento exponencial e saturação; equação diferencial</td><td>Guinsoo (taxa que muda com o tempo)</td></tr>
<tr><td>Nível e itens</td><td>Valor esperado; integral no tempo</td><td>Crítico; Guinsoo</td></tr>
<tr><td>Avaliar duelos</td><td>Lei de Lanchester (força ∝ N²)</td><td>DPS e vida efetiva</td></tr>
<tr><td>Concentrar ou espalhar</td><td>Área sob a curva; conservação</td><td>Armadura e DPS contra o Ornn</td></tr>
</table>
<p>${DADOS} Fase de planejamento: ${duracaoPlanejamento} s por rodada. Dá tempo para uma conta de cabeça, desde que você saiba <b>qual</b> conta fazer: esse é o objetivo da aula.</p>

<h2>Fontes e limites</h2>
<ul>
<li>${esc(fonte)} Arquivos: <code>cdragon/tft/pt_br.json</code> e <code>game/data/maps/shipping/map22/map22.bin.json</code> (chances da loja do set ${SET}, rodadas por estágio, duração das fases, tabela de dano por estágio).</li>
<li>Juros, renda, bônus de sequência e XP não aparecem nos arquivos: estão no quadro “Regras usadas”, para conferir no jogo.</li>
<li>Dano por inimigo vivo: <a href="${FONTE_DANO_UNIDADE}">notas oficiais da atualização 14.8</a> (Riot). Multiplicadores de estrela: <a href="${FONTE_ESTRELAS}">Wiki do LoL</a>, também em TFT Codex e TFT Ninja (não oficiais).</li>
<li>Os modelos (Lanchester, crescimento exponencial, área sob a curva) simplificam o jogo de propósito: servem para escolher a pergunta certa, não para prever o placar.</li>
</ul>
</body></html>`

const pdf = gerarPdf("early-game-tft", html)
console.log(`Gerado: ${pdf}`)
console.log({ pvpPorEstagio, cenarios: cenarios.map((c) => [c.nome, c.ouro, c.vida]), economias, tempoAte50, t1Foco, tFimFoco, tFimEsp, danoRecebidoFoco, danoRecebidoEsp })
