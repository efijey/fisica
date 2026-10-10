import type { CardLiteratura } from "@/app/physics/personalizado/tipos"

/**
 * Cards = âncora científica do paciente zero.
 *
 * Substitua/edite `trecho` e metadados da `citacao` com trechos dos seus PDFs.
 * Até lá, seed com OpenStax University Physics (CC BY) — material aberto e citável.
 *
 * Como alimentar: docs/fontes-cientificas.md
 */
export const cardsLiteratura: CardLiteratura[] = [
  {
    id: "vm_deslocamento_tempo",
    conceito: "Velocidade média",
    area: "cinematica",
    formulaIds: ["velocidade_media"],
    variavelIds: ["velocidade.media", "posicao.delta", "tempo.delta"],
    citacao: {
      id: "openstax-up1-3-1",
      obra: "University Physics Volume 1",
      autores: "OpenStax",
      secao: "3.1 Position, Displacement, and Average Velocity",
      url: "https://openstax.org/books/university-physics-volume-1/pages/3-1-position-displacement-and-average-velocity",
      licenca: "CC BY 4.0",
    },
    trecho:
      "Average velocity is defined as the change in position (displacement) divided by the elapsed time. If x is position and t is time, the average velocity is v̄ = Δx / Δt. Average velocity depends only on the endpoints of the interval, not on the details of the path between them.",
    objetivoAprendizagem:
      "Explicar que velocidade média é a razão entre deslocamento e intervalo de tempo — sem confundir com velocidade instantânea.",
  },
  {
    id: "aceleracao_media",
    conceito: "Aceleração média",
    area: "cinematica",
    formulaIds: ["mruv_velocidade_final"],
    variavelIds: [
      "aceleracao.modulo",
      "velocidade.inicial",
      "velocidade.final",
      "tempo.modulo",
    ],
    citacao: {
      id: "openstax-up1-3-3",
      obra: "University Physics Volume 1",
      autores: "OpenStax",
      secao: "3.3 Average and Instantaneous Acceleration",
      url: "https://openstax.org/books/university-physics-volume-1/pages/3-3-average-and-instantaneous-acceleration",
      licenca: "CC BY 4.0",
    },
    trecho:
      "Average acceleration is the rate at which velocity changes: ā = Δv / Δt. A change in velocity can be a change in magnitude, in direction, or both. Instantaneous acceleration is the limit of average acceleration as the time interval approaches zero.",
    objetivoAprendizagem:
      "Relacionar aceleração à variação de velocidade no tempo; reconhecer freada como aceleração com sentido oposto à velocidade.",
  },
  {
    id: "segunda_lei_newton",
    conceito: "Segunda lei de Newton",
    area: "dinamica",
    formulaIds: ["segunda_lei_newton"],
    variavelIds: ["forca.resultante", "massa.modulo", "aceleracao.modulo"],
    citacao: {
      id: "openstax-up1-5-3",
      obra: "University Physics Volume 1",
      autores: "OpenStax",
      secao: "5.3 Newton's Second Law",
      url: "https://openstax.org/books/university-physics-volume-1/pages/5-3-newtons-second-law",
      licenca: "CC BY 4.0",
    },
    trecho:
      "Newton's second law states that the net external force on a body is equal to the product of the body's mass and its acceleration: F_net = m a. Acceleration has the same direction as the net force. Mass is a measure of inertia — resistance to changes in motion.",
    objetivoAprendizagem:
      "Explicar que a força resultante é o que determina a aceleração, proporcionalmente à massa do corpo.",
  },
]

export function cardPorId(id: string): CardLiteratura | undefined {
  return cardsLiteratura.find((c) => c.id === id)
}
