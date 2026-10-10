/**
 * Converte fala de contas/fórmulas (PT-BR) em notação matemática legível.
 * Local, sem LLM — tipografia para localizar o cálculo na folha.
 */

export type BlocoFalaFormatada =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "equacao"; expressao: string; texto?: string }
  | { tipo: "misto"; paragrafo: string; expressao: string }

const UNIDADES: Record<string, number> = {
  zero: 0,
  um: 1,
  uma: 1,
  dois: 2,
  duas: 2,
  tres: 3,
  três: 3,
  quatro: 4,
  cinco: 5,
  seis: 6,
  sete: 7,
  oito: 8,
  nove: 9,
  dez: 10,
  onze: 11,
  doze: 12,
  treze: 13,
  quatorze: 14,
  catorze: 14,
  quinze: 15,
  dezesseis: 16,
  dezessete: 17,
  dezassete: 17,
  dezoito: 18,
  dezenove: 19,
  dezanove: 19,
}

const DEZENAS: Record<string, number> = {
  vinte: 20,
  trinta: 30,
  quarenta: 40,
  cinquenta: 50,
  sessenta: 60,
  setenta: 70,
  oitenta: 80,
  noventa: 90,
}

const CENTENAS: Record<string, number> = {
  cem: 100,
  cento: 100,
  duzentos: 200,
  duzentas: 200,
  trezentos: 300,
  trezentas: 300,
  quatrocentos: 400,
  quatrocentas: 400,
  quinhentos: 500,
  quinhentas: 500,
  seiscentos: 600,
  seiscentas: 600,
  setecentos: 700,
  setecentas: 700,
  oitocentos: 800,
  oitocentas: 800,
  novecentos: 900,
  novecentas: 900,
}

function normToken(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
}

/** Número (dígitos) ou variável curta — fronteira manual (Unicode/grego). */
const TERMO_INNER = String.raw`(?:\d+(?:[.,]\d+)?|[A-Za-zΑ-Ωα-ωΔδ][A-Za-z0-9Α-Ωα-ωΔδ₀-₉]{0,3})[²³]?`
const TERMO = String.raw`${TERMO_INNER}`

/** Fronteira que trata letras gregas como “palavra”. */
function entreTermos(opFalado: string, simbolo: string, frase: string): string {
  const re = new RegExp(
    `(?<![A-Za-z0-9Α-Ωα-ωΔδ₀-₉])(${TERMO})\\s+${opFalado}\\s+(${TERMO})(?![A-Za-z0-9Α-Ωα-ωΔδ₀-₉])`,
    "gi"
  )
  let s = frase
  let prev = ""
  while (prev !== s) {
    prev = s
    s = s.replace(re, `$1 ${simbolo} $2`)
  }
  return s
}

function substituirNumerosExtenso(frase: string): string {
  let s = frase

  s = s.replace(
    /\b(vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa)(?:\s+e)?\s+(um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove)\b/gi,
    (_, dez, uni) => {
      const d = DEZENAS[normToken(dez)] ?? 0
      const u = UNIDADES[normToken(uni)] ?? 0
      return String(d + u)
    }
  )

  s = s.replace(
    /\b(vinte|trinta|quarenta|cinquenta|sessenta|setenta|oitenta|noventa)\b/gi,
    (m) => String(DEZENAS[normToken(m)] ?? m)
  )

  // "um" / "uma" explícitos (evitar `uma?` ambíguo)
  s = s.replace(
    /\b(zero|um|uma|dois|duas|tr[eê]s|quatro|cinco|seis|sete|oito|nove|dez|onze|doze|treze|quatorze|catorze|quinze|dezesseis|dezessete|dezassete|dezoito|dezenove|dezanove)\b/gi,
    (m) => {
      const v = UNIDADES[normToken(m)]
      return v === undefined ? m : String(v)
    }
  )

  s = s.replace(
    /\b(cem|cento|duzent[oa]s|trezent[oa]s|quatrocent[oa]s|quinhent[oa]s|seiscent[oa]s|setecent[oa]s|oitocent[oa]s|novecent[oa]s)\b/gi,
    (m) => String(CENTENAS[normToken(m)] ?? 100)
  )

  s = s.replace(/\bmil\b/gi, "1000")
  return s
}

function operadoresParaSimbolos(frase: string): string {
  let s = frase

  // potências grudadas no termo anterior: "5 ao quadrado" → "5²"
  s = s.replace(/(\S+)\s+ao\s+quadrado\b/gi, "$1²")
  s = s.replace(/(\S+)\s+ao\s+cubo\b/gi, "$1³")
  s = s.replace(/\braiz\s+quadrada\s+de\b/gi, "√")
  s = s.replace(/\braiz\s+de\b/gi, "√")

  s = entreTermos("multiplicado\\s+por", "×", s)
  s = entreTermos("vezes", "×", s)
  s = entreTermos("dividido\\s+por", "/", s)
  s = entreTermos("dividido", "/", s)
  s = entreTermos("sobre", "/", s)
  s = entreTermos("mais", "+", s)
  s = entreTermos("menos", "−", s)

  s = entreTermos("(?:[eé]\\s+)?igual(?:\\s+a)?", "=", s)
  s = entreTermos("resulta\\s+em", "=", s)
  s = entreTermos("d[aá]", "=", s)
  s = entreTermos("é", "=", s)

  s = s.replace(/\bigual\s+a\b/gi, " = ")
  s = s.replace(/\bigual\b/gi, " = ")

  s = s.replace(/\b(\d+)\s+ponto\s+(\d+)\b/gi, "$1.$2")
  s = s.replace(/\b(\d+)\s+v[ií]rgula\s+(\d+)\b/gi, "$1,$2")

  s = s.replace(
    /=\s*([A-Za-zΑ-Ωα-ω])\s+([A-Za-zΑ-Ωα-ω])(?![A-Za-z0-9])/g,
    "= $1 · $2"
  )

  return s
    .replace(/\s*([+\−×/=])\s*/g, " $1 ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

/** Mantém maiúsculas das variáveis como no transcript (F, Δ…). */
function restaurarCasasDoOriginal(expressao: string, original: string): string {
  const toks = original.match(/[A-Za-zΑ-Ωα-ωΔδ]+/g) ?? []
  let out = expressao
  for (const tok of toks) {
    if (tok.length > 3) continue
    if (/^(mais|menos|vezes|sobre|igual|da|dá)$/i.test(tok)) continue
    out = out.replace(new RegExp(`\\b${tok}\\b`, "i"), tok)
  }
  return out
}

function limparResiduos(expr: string): string {
  return expr
    .replace(
      /\b(que|então|entao|logo|assim|fica|calcular|calculo|cálculo|obter|obtenho|resultado|resulta)\b/gi,
      " "
    )
    .replace(/\s*([+\−×/=])\s*/g, " $1 ")
    .replace(/([²³])(?=\S)/g, "$1 ")
    .replace(/\s{2,}/g, " ")
    .trim()
}

function pareceContaOuEquacao(expressao: string): boolean {
  const e = expressao.trim()
  if (!e || e.length > 80) return false

  const resto = e
    .replace(/[0-9+\−\-=×/√²³·.,()]/g, " ")
    .replace(
      /(?<![A-Za-z0-9Α-Ωα-ωΔδ])[A-Za-zΑ-Ωα-ωΔδ][A-Za-z0-9Α-Ωα-ωΔδ₀-₉]{0,3}(?![A-Za-z0-9Α-Ωα-ωΔδ])/g,
      " "
    )
    .replace(/\s+/g, " ")
    .trim()
  if (resto.length > 0) return false

  const temOp = /[+\−\-=×/√²³·]/.test(e)
  const temNum = /\d/.test(e)
  const temVar = /[A-Za-zΑ-Ωα-ωΔδ]/.test(e)

  if (/=/.test(e) && (temNum || temVar)) return true
  if (temOp && temNum) return true
  if (temOp && temVar && e.length <= 48) return true
  return false
}

function capitalizar(s: string): string {
  const t = s.trim()
  if (!t) return t
  return t.charAt(0).toUpperCase() + t.slice(1)
}

function paraExpressao(candidato: string, original: string): string | null {
  let expr = candidato
  // delta / Δ falados → "delta S" vira "ΔS"
  expr = expr.replace(/\bdelta\s+([A-Za-zΑ-Ωα-ω])/gi, "Δ$1")
  expr = expr.replace(/\bdelta\b/gi, "Δ")
  expr = substituirNumerosExtenso(expr)
  expr = operadoresParaSimbolos(expr)
  expr = limparResiduos(expr)
  expr = restaurarCasasDoOriginal(expr, original)
  if (!pareceContaOuEquacao(expr)) return null
  return expr
}

function extrairMatematica(frase: string): {
  expressao: string | null
  paragrafo: string | null
} {
  const bruto = frase.trim().replace(/\s+/g, " ")

  // 1) trecho após gatilho ("fica", "calcular"…) — prioridade para mistos
  const gatilho =
    /^(.*?)(?:\b(?:calcular|cálculo|calculo|fica|então|entao|logo|assim|obter|obtenho|resulta(?:\s+em)?|resultado)\b[,:]?\s+)(.+)$/i
  const m = bruto.match(gatilho)
  if (m?.[2]) {
    const expr = paraExpressao(m[2], bruto)
    if (expr) {
      const pref = (m[1] ?? "").trim().replace(/[,:]\s*$/, "")
      return {
        expressao: expr,
        paragrafo: pref.length >= 8 ? capitalizar(pref) : null,
      }
    }
  }

  // 2) frase inteira é uma conta/fórmula
  const direto = paraExpressao(bruto, bruto)
  if (direto) {
    return { expressao: direto, paragrafo: null }
  }

  return { expressao: null, paragrafo: null }
}

export function formatarFalaParaFolha(transcript: string): BlocoFalaFormatada {
  const bruto = transcript.trim().replace(/\s+/g, " ")
  if (!bruto) return { tipo: "paragrafo", texto: "" }

  const { expressao, paragrafo } = extrairMatematica(bruto)

  if (expressao && paragrafo) {
    return { tipo: "misto", paragrafo, expressao }
  }

  if (expressao) {
    return { tipo: "equacao", expressao }
  }

  return { tipo: "paragrafo", texto: capitalizar(bruto) }
}
