import type {
  ProblemaConceitual,
  RubricaProblema,
  Veredito,
} from "./catalog";

export interface ResultadoJuiz {
  veredito: Veredito;
  acertos: string[];
  faltando: string[];
  proibidos: string[];
  feedback: string;
}

/** Remove acentos e normaliza para busca por substring. */
export function normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s=+\-./,]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function variantesDe(conceito: string): string[] {
  return conceito
    .split("|")
    .map((v) => normalizarTexto(v))
    .filter(Boolean);
}

function conceitoPresente(textoNorm: string, conceito: string): boolean {
  return variantesDe(conceito).some((variante) => {
    if (variante.length <= 2) {
      // Tokens curtos (ex.: "g ") — exige limite de palavra aproximado
      const re = new RegExp(
        `(^|\\s)${variante.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`
      );
      return re.test(` ${textoNorm} `);
    }
    return textoNorm.includes(variante);
  });
}

/** Rótulo legível da primeira variante do conceito. */
function rotuloConceito(conceito: string): string {
  const primeira = conceito.split("|")[0]?.trim() ?? conceito;
  return primeira;
}

function avaliarRubrica(
  textoNorm: string,
  rubrica: RubricaProblema
): {
  acertos: string[];
  faltando: string[];
  proibidos: string[];
  hitsEfetivos: number;
} {
  const acertos: string[] = [];
  const faltando: string[] = [];

  for (const conceito of rubrica.conceitosObrigatorios) {
    if (conceitoPresente(textoNorm, conceito)) {
      acertos.push(rotuloConceito(conceito));
    } else {
      faltando.push(rotuloConceito(conceito));
    }
  }

  let bonusAlternativos = 0;
  for (const alt of rubrica.conceitosAlternativos ?? []) {
    if (conceitoPresente(textoNorm, alt)) {
      bonusAlternativos += 1;
      const rotulo = rotuloConceito(alt);
      if (!acertos.includes(rotulo)) {
        acertos.push(rotulo);
      }
    }
  }

  const proibidos: string[] = [];
  for (const proibido of rubrica.conceitosProibidos ?? []) {
    if (conceitoPresente(textoNorm, proibido)) {
      proibidos.push(rotuloConceito(proibido));
    }
  }

  const hitsObrigatorios = rubrica.conceitosObrigatorios.length - faltando.length;
  // Alternativos podem cobrir até o número de faltantes
  const coberturaExtra = Math.min(bonusAlternativos, faltando.length);
  const hitsEfetivos = hitsObrigatorios + coberturaExtra;

  return { acertos, faltando, proibidos, hitsEfetivos };
}

function montarFeedback(
  veredito: Veredito,
  acertos: string[],
  faltando: string[],
  proibidos: string[],
  dica: string
): string {
  const partes: string[] = [];

  if (veredito === "certo") {
    partes.push(
      "Boa! Seu raciocínio usa os conceitos certos para este problema."
    );
    if (acertos.length > 0) {
      partes.push(`Você mencionou: ${acertos.join(", ")}.`);
    }
  } else if (veredito === "no_caminho") {
    partes.push(
      "Você está no caminho certo, mas ainda faltam ideias importantes."
    );
    if (acertos.length > 0) {
      partes.push(`Já apareceu: ${acertos.join(", ")}.`);
    }
    if (faltando.length > 0) {
      partes.push(`Vale reforçar: ${faltando.join(", ")}.`);
    }
    partes.push(`Dica: ${dica}`);
  } else {
    partes.push(
      "O raciocínio ainda não aponta para os conceitos deste problema."
    );
    if (proibidos.length > 0) {
      partes.push(
        `Cuidado com ideias que desviam aqui: ${proibidos.join(", ")}.`
      );
    }
    if (faltando.length > 0) {
      partes.push(`Tente incluir: ${faltando.join(", ")}.`);
    }
    partes.push(`Dica: ${dica}`);
  }

  return partes.join(" ");
}

export function julgarResposta(
  problema: ProblemaConceitual,
  resposta: string
): ResultadoJuiz {
  const textoNorm = normalizarTexto(resposta);

  if (!textoNorm) {
    return {
      veredito: "desviado",
      acertos: [],
      faltando: problema.rubrica.conceitosObrigatorios.map(rotuloConceito),
      proibidos: [],
      feedback:
        "Escreva com suas palavras como você resolveria o problema. " +
        `Dica: ${problema.dica}`,
    };
  }

  const { acertos, faltando, proibidos, hitsEfetivos } = avaliarRubrica(
    textoNorm,
    problema.rubrica
  );

  const total = problema.rubrica.conceitosObrigatorios.length;
  const min = problema.rubrica.minObrigatorios;

  let veredito: Veredito;
  if (proibidos.length > 0 && hitsEfetivos < min) {
    veredito = "desviado";
  } else if (hitsEfetivos >= total && proibidos.length === 0) {
    veredito = "certo";
  } else if (hitsEfetivos >= min) {
    // Proibido + bons hits → ainda no caminho, mas o feedback cita o equívoco
    veredito = "no_caminho";
  } else {
    veredito = "desviado";
  }

  // Se bateu todos os obrigatórios mas citou proibido, não fecha como "certo"
  if (hitsEfetivos >= total && proibidos.length > 0) {
    veredito = "no_caminho";
  }

  return {
    veredito,
    acertos,
    faltando: veredito === "certo" ? [] : faltando,
    proibidos,
    feedback: montarFeedback(
      veredito,
      acertos,
      faltando,
      proibidos,
      problema.dica
    ),
  };
}
