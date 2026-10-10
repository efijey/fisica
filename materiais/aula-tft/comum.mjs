import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import katex from "katex"

export const aqui = dirname(fileURLToPath(import.meta.url))
export const cache = join(aqui, ".cache")
export const saida = join(aqui, "saida")
mkdirSync(cache, { recursive: true })
mkdirSync(saida, { recursive: true })

export const SET = process.env.TFT_SET ?? "18"
export const BASE = "https://raw.communitydragon.org/latest"
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

// O CDN recusa o user-agent padrão de scripts; curl é aceito.
export function baixar(url, arquivo) {
  const destino = join(cache, arquivo)
  if (!existsSync(destino)) execFileSync("curl", ["-s", "-f", "-o", destino, url])
  return JSON.parse(readFileSync(destino, "utf8"))
}

export function versaoDoJogo() {
  return baixar(`${BASE}/content-metadata.json`, "content-metadata.json").version.split("+")[0]
}

export function fmt(n, casas = 2) {
  if (n == null) return "—"
  return n.toLocaleString("pt-BR", { maximumFractionDigits: casas })
}
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
export const mi = (tex) => katex.renderToString(tex, { throwOnError: false })
export const md = (tex) => katex.renderToString(tex, { throwOnError: false, displayMode: true })
export const n = (v, casas = 2) => fmt(v, casas).replace(",", "{,}")

const tag = (t) => `<span class="tag tag-${t.toLowerCase().normalize("NFD").replace(/[^a-z]/g, "")}">${t}</span>`
export const DADOS = tag("Dados")
export const REGRA = tag("Regra")
export const MODELO = tag("Modelo")
export const HIPOTESE = tag("Hipotético")
export const MEDIR = tag("Medir no jogo")

export const legendaEtiquetas = `<div class="caixa">
<b>Como ler as etiquetas.</b> Cada afirmação tem uma etiqueta dizendo de onde vem:<br>
${DADOS} número tirado dos arquivos do jogo. ${REGRA} regra de mecânica conhecida da comunidade; não vem nos arquivos, então vale conferir no jogo antes de afirmar em aula.
${MODELO} simplificação nossa para a conta caber no quadro. ${HIPOTESE} número inventado só para ilustrar. ${MEDIR} algo que dá para medir ao vivo durante a aula.
</div>`

const katexCss = readFileSync(join(aqui, "../../node_modules/katex/dist/katex.min.css"), "utf8").replace(
  /url\(fonts\//g,
  `url(file://${join(aqui, "../../node_modules/katex/dist/fonts/")}`,
)

export const estilo = `<style>${katexCss}
@page { size: A4; margin: 16mm 14mm; }
body { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 10.5pt; line-height: 1.5; color: #1c1c1c; }
h1 { font-size: 22pt; margin: 0 0 4pt; } h2 { font-size: 15pt; margin: 22pt 0 6pt; border-bottom: 2px solid #7c3aed; padding-bottom: 3pt; break-after: avoid; }
h3 { font-size: 12pt; margin: 14pt 0 4pt; break-after: avoid; }
.sub { color: #555; font-size: 11pt; } .pequeno { color: #666; font-size: 8.5pt; }
.caixa { border: 1px solid #ddd; border-radius: 6px; padding: 8pt 10pt; margin: 8pt 0; break-inside: avoid; }
.caixa.aula { border-left: 4px solid #7c3aed; } .caixa.resposta { background: #f6f3ff; border-color: #d9ccff; }
.caixa.curta { background: #fffbeb; border-color: #fde68a; }
.tag { display: inline-block; font-size: 7.5pt; font-weight: 600; padding: 0 5pt; border-radius: 8pt; margin-right: 3pt; vertical-align: 1pt; }
.tag-dados { background: #dcfce7; color: #166534; } .tag-regra { background: #fef3c7; color: #92400e; }
.tag-modelo { background: #dbeafe; color: #1e40af; } .tag-hipotetico { background: #fee2e2; color: #991b1b; } .tag-medirnojogo { background: #ede9fe; color: #5b21b6; }
table { border-collapse: collapse; width: 100%; margin: 6pt 0; font-size: 8.5pt; }
th, td { border-bottom: 1px solid #e5e5e5; padding: 2.5pt 4pt; text-align: right; vertical-align: top; }
th { background: #f4f4f5; text-align: center; font-weight: 600; } td.nome, td.desc { text-align: left; } td.desc { font-size: 8pt; }
table.texto td { text-align: left; } tr { break-inside: avoid; } .quebra { break-before: page; }
.katex-display { margin: 4pt 0; } ol li, ul li { margin: 2pt 0; }
</style>`

export function gerarPdf(nome, html) {
  const arquivoHtml = join(saida, `${nome}.html`)
  const arquivoPdf = join(saida, `${nome}.pdf`)
  writeFileSync(arquivoHtml, html)
  execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${arquivoPdf}`, `file://${arquivoHtml}`], { stdio: "ignore" })
  return arquivoPdf
}
