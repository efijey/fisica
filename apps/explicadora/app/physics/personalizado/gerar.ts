import { generateObject } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { z } from "zod"
import { exemplosModelo } from "@/app/physics/personalizado/exemplos-modelo"
import { cardPorId } from "@/app/physics/personalizado/literatura/cards"
import { mundoPorId } from "@/app/physics/personalizado/mundos/catalog"
import type { ProblemaPersonalizado } from "@/app/physics/personalizado/tipos"

const MODELO_PADRAO = "gpt-4o-mini"

const geradoSchema = z.object({
  titulo: z.string(),
  contexto: z.string(),
  pergunta: z.string(),
  explicacao: z.string(),
  dica: z.string(),
})

export type PedidoGeracaoPersonalizada = {
  mundoId: string
  cardId: string
}

export type ResultadoGeracao =
  | { ok: true; problema: ProblemaPersonalizado; modelo: string }
  | { ok: false; erro: string }

function systemPrompt(): string {
  return `Você cria exercícios conceituais de física para um estudante brasileiro (ensino médio).
Objetivo pedagógico: baixar carga cognitiva usando um MUNDO FAMILIAR (jogo), sem alterar a física.

REGRAS RÍGIDAS:
1. A física SÓ pode vir do TRECHO CANÔNICO e das fórmulas/variáveis listadas. Não invente leis, constantes ou fórmulas.
2. Na "explicacao", parafraseie o trecho em português claro e cite a obra pelo nome. Não acrescente teoria fora do trecho.
3. O MUNDO (TFT/LoL) só fornece narrativa e entidades. Use APENAS os fatos do mundo listados — não invente números oficiais de patch, itens ou mecânicas não listadas.
4. Números do enunciado podem ser hipotéticos e didáticos (ex.: "percorre 4 hexes em 2 s"), desde que o raciocínio peça o conceito certo.
5. A pergunta deve pedir EXPLICAÇÃO do raciocínio (quais grandezas, como se relacionam), não só a conta.
6. Escreva em português do Brasil, tom de treino amigável, sem spoilers desnecessários de lore.
7. Imite o tom, o tamanho e a estrutura dos EXERCÍCIOS MODELO: situação curta e concreta, uma pergunta que obriga a comparar ou decidir algo, explicação que fecha a ideia.
8. Os modelos são de OUTROS conceitos: copie o estilo, nunca a situação.
9. Use unidades que o jogador daquele mundo reconhece, nunca "unidades de distância" genéricas. TFT: hexes e segundos. LoL: trechos do mapa ("meia lane", "da torre até a base") e segundos — LoL não tem hexes.`
}

function blocoExemplosModelo(cardId: string): string {
  return exemplosModelo
    .filter((e) => e.cardId !== cardId)
    .map(
      (e, i) => `MODELO ${i + 1} (mundo: ${e.mundoId}, conceito: ${e.cardId})
- titulo: ${e.titulo}
- contexto: ${e.contexto}
- pergunta: ${e.pergunta}
- explicacao: ${e.explicacao}
- dica: ${e.dica}`
    )
    .join("\n\n")
}

function userPrompt(mundoId: string, cardId: string): string | null {
  const card = cardPorId(cardId)
  const mundo = mundoPorId(mundoId)
  if (!card || !mundo) return null

  return `CARD DE LITERATURA (âncora científica):
- id: ${card.id}
- conceito: ${card.conceito}
- objetivo: ${card.objetivoAprendizagem}
- formulaIds: ${card.formulaIds.join(", ")}
- variavelIds: ${card.variavelIds.join(", ")}
- obra: ${card.citacao.obra} — ${card.citacao.autores}
- seção: ${card.citacao.secao ?? "—"}
- trecho canônico (INGLÊS OU PT — respeite o sentido):
"""
${card.trecho}
"""

MUNDO DO INTERESSE (pele narrativa):
- id: ${mundo.id}
- nome: ${mundo.nome}
- entidades permitidas: ${mundo.entidades.join(", ")}
- fatos permitidos:
${mundo.fatos.map((f) => `  - (${f.id}) ${f.texto}`).join("\n")}

EXERCÍCIOS MODELO (referência de estilo):
${blocoExemplosModelo(card.id)}

Gere um único exercício personalizado nesse mundo, fiel ao trecho.`
}

function montarProblema(
  mundoId: string,
  cardId: string,
  gerado: z.infer<typeof geradoSchema>
): ProblemaPersonalizado | null {
  const card = cardPorId(cardId)
  if (!card) return null

  return {
    id: `pers-${mundoId}-${cardId}-${Date.now().toString(36)}`,
    criadoEm: new Date().toISOString(),
    mundoId,
    cardId,
    titulo: gerado.titulo.trim(),
    contexto: gerado.contexto.trim(),
    pergunta: gerado.pergunta.trim(),
    explicacao: gerado.explicacao.trim(),
    formulaIds: card.formulaIds,
    variavelIds: card.variavelIds,
    citacao: card.citacao,
    dica: gerado.dica.trim(),
    rubrica: card.rubrica,
  }
}

/** Fallback determinístico se não houver OPENAI_API_KEY. */
export function gerarProblemaMock(
  pedido: PedidoGeracaoPersonalizada
): ResultadoGeracao {
  const card = cardPorId(pedido.cardId)
  const mundo = mundoPorId(pedido.mundoId)
  if (!card || !mundo) {
    return { ok: false, erro: "mundoId ou cardId inválido" }
  }

  const entidade = mundo.entidades[0] ?? "personagem"
  const fato = mundo.fatos[0]?.texto ?? mundo.descricao

  const problema = montarProblema(pedido.mundoId, pedido.cardId, {
    titulo: `${card.conceito} em ${mundo.nome}`,
    contexto: `No universo de ${mundo.nome}, imagine um(a) ${entidade} em deslocamento. Fato do mundo: ${fato} Você quer treinar o conceito de ${card.conceito.toLowerCase()} sem se perder em detalhes irrelevantes do jogo.`,
    pergunta: `Com suas palavras: quais grandezas você usaria para falar de ${card.conceito.toLowerCase()} nessa situação, e como elas se relacionam? (Não precisa calcular o número.)`,
    explicacao: `${card.objetivoAprendizagem} Base canônica (${card.citacao.obra}, ${card.citacao.autores}${card.citacao.secao ? `, ${card.citacao.secao}` : ""}): sentido de «${card.trecho.slice(0, 160)}…». A pele de ${mundo.nome} só ilustra; a definição vem da fonte.`,
    dica: card.objetivoAprendizagem,
  })

  if (!problema) return { ok: false, erro: "Falha ao montar problema mock" }
  return { ok: true, problema, modelo: "mock" }
}

export async function gerarProblemaPersonalizado(
  pedido: PedidoGeracaoPersonalizada
): Promise<ResultadoGeracao> {
  const prompt = userPrompt(pedido.mundoId, pedido.cardId)
  if (!prompt) {
    return { ok: false, erro: "mundoId ou cardId inválido" }
  }

  const key = process.env.OPENAI_API_KEY?.trim()
  if (!key) {
    return gerarProblemaMock(pedido)
  }

  const modelo = process.env.OPENAI_MODEL_PERSONALIZADO?.trim() || MODELO_PADRAO
  // Modelos de raciocínio (gpt-5*, o*) rejeitam temperature.
  const aceitaTemperatura = !/^(gpt-5|o\d)/.test(modelo)

  try {
    const openai = createOpenAI({ apiKey: key })
    const { object } = await generateObject({
      model: openai(modelo),
      schema: geradoSchema,
      system: systemPrompt(),
      prompt,
      ...(aceitaTemperatura ? { temperature: 0.7 } : {}),
    })

    const problema = montarProblema(pedido.mundoId, pedido.cardId, object)
    if (!problema) {
      return { ok: false, erro: "Falha ao montar problema gerado" }
    }
    return { ok: true, problema, modelo }
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : "Falha na geração"
    console.error("[personalizado/gerar]", mensagem)
    const mock = gerarProblemaMock(pedido)
    if (mock.ok) {
      return {
        ok: true,
        problema: mock.problema,
        modelo: `mock-apos-erro:${mensagem.slice(0, 80)}`,
      }
    }
    return { ok: false, erro: mensagem }
  }
}
