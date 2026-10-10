import type { ProblemaPersonalizado } from "@/app/physics/personalizado/tipos"

const KEY_PROBLEMAS = "fisica.personalizado.problemas.v1"
const KEY_PREFS = "fisica.personalizado.prefs.v1"

export type PrefsPersonalizado = {
  mundoId: string
  cardId: string
}

export function lerPrefs(): PrefsPersonalizado {
  if (typeof window === "undefined") {
    return { mundoId: "tft", cardId: "vm_deslocamento_tempo" }
  }
  try {
    const raw = localStorage.getItem(KEY_PREFS)
    if (!raw) return { mundoId: "tft", cardId: "vm_deslocamento_tempo" }
    const parsed = JSON.parse(raw) as PrefsPersonalizado
    return {
      mundoId: parsed.mundoId || "tft",
      cardId: parsed.cardId || "vm_deslocamento_tempo",
    }
  } catch {
    return { mundoId: "tft", cardId: "vm_deslocamento_tempo" }
  }
}

export function salvarPrefs(prefs: PrefsPersonalizado) {
  localStorage.setItem(KEY_PREFS, JSON.stringify(prefs))
}

export function lerProblemasSalvos(): ProblemaPersonalizado[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY_PROBLEMAS)
    if (!raw) return []
    const parsed = JSON.parse(raw) as ProblemaPersonalizado[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function salvarProblema(problema: ProblemaPersonalizado) {
  const atual = lerProblemasSalvos()
  const next = [problema, ...atual.filter((p) => p.id !== problema.id)].slice(
    0,
    30
  )
  localStorage.setItem(KEY_PROBLEMAS, JSON.stringify(next))
  return next
}

export function removerProblema(id: string) {
  const next = lerProblemasSalvos().filter((p) => p.id !== id)
  localStorage.setItem(KEY_PROBLEMAS, JSON.stringify(next))
  return next
}

export function limparProblemas() {
  localStorage.removeItem(KEY_PROBLEMAS)
}
