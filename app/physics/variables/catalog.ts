// physics/variables/catalog.ts

export interface VariavelFisica {
    id: string;
    simbolo: string;
    nome: string;
    unidade: string;
    categoria: CategoriaFisica;
  }
  
  export type CategoriaFisica =
    | "cinematica"
    | "dinamica"
    | "energia"
    | "rotacao"
    | "gravitacao"
    | "momento";
  
  export const catalogoVariaveis: VariavelFisica[] = [
    // ==================== CINEMÁTICA ====================
    {
      id: "tempo.modulo",
      simbolo: "t",
      nome: "Tempo",
      unidade: "s",
      categoria: "cinematica"
    },
    {
      id: "tempo.inicial",
      simbolo: "t₀",
      nome: "Tempo inicial",
      unidade: "s",
      categoria: "cinematica"
    },
    {
      id: "tempo.final",
      simbolo: "t",
      nome: "Tempo final",
      unidade: "s",
      categoria: "cinematica"
    },
    {
      id: "tempo.delta",
      simbolo: "Δt",
      nome: "Intervalo de tempo",
      unidade: "s",
      categoria: "cinematica"
    },
    {
      id: "posicao.modulo",
      simbolo: "s",
      nome: "Posição",
      unidade: "m",
      categoria: "cinematica"
    },
    {
      id: "posicao.inicial",
      simbolo: "s₀",
      nome: "Posição inicial",
      unidade: "m",
      categoria: "cinematica"
    },
    {
      id: "posicao.final",
      simbolo: "s",
      nome: "Posição final",
      unidade: "m",
      categoria: "cinematica"
    },
    {
      id: "posicao.delta",
      simbolo: "Δs",
      nome: "Deslocamento",
      unidade: "m",
      categoria: "cinematica"
    },
    {
      id: "velocidade.modulo",
      simbolo: "v",
      nome: "Velocidade",
      unidade: "m/s",
      categoria: "cinematica"
    },
    {
      id: "velocidade.inicial",
      simbolo: "v₀",
      nome: "Velocidade inicial",
      unidade: "m/s",
      categoria: "cinematica"
    },
    {
      id: "velocidade.final",
      simbolo: "v",
      nome: "Velocidade final",
      unidade: "m/s",
      categoria: "cinematica"
    },
    {
      id: "velocidade.media",
      simbolo: "vₘ",
      nome: "Velocidade média",
      unidade: "m/s",
      categoria: "cinematica"
    },
    {
      id: "aceleracao.modulo",
      simbolo: "a",
      nome: "Aceleração",
      unidade: "m/s²",
      categoria: "cinematica"
    },
    {
      id: "aceleracao.centripeta",
      simbolo: "a꜀",
      nome: "Aceleração centrípeta",
      unidade: "m/s²",
      categoria: "cinematica"
    },
    {
      id: "aceleracao.tangencial",
      simbolo: "aₜ",
      nome: "Aceleração tangencial",
      unidade: "m/s²",
      categoria: "cinematica"
    },
    {
      id: "posicaoAngular.modulo",
      simbolo: "θ",
      nome: "Posição angular",
      unidade: "rad",
      categoria: "cinematica"
    },
    {
      id: "posicaoAngular.inicial",
      simbolo: "θ₀",
      nome: "Posição angular inicial",
      unidade: "rad",
      categoria: "cinematica"
    },
    {
      id: "posicaoAngular.final",
      simbolo: "θ",
      nome: "Posição angular final",
      unidade: "rad",
      categoria: "cinematica"
    },
    {
      id: "posicaoAngular.delta",
      simbolo: "Δθ",
      nome: "Deslocamento angular",
      unidade: "rad",
      categoria: "cinematica"
    },
    {
      id: "velocidadeAngular.modulo",
      simbolo: "ω",
      nome: "Velocidade angular",
      unidade: "rad/s",
      categoria: "cinematica"
    },
    {
      id: "velocidadeAngular.inicial",
      simbolo: "ω₀",
      nome: "Velocidade angular inicial",
      unidade: "rad/s",
      categoria: "cinematica"
    },
    {
      id: "velocidadeAngular.final",
      simbolo: "ω",
      nome: "Velocidade angular final",
      unidade: "rad/s",
      categoria: "cinematica"
    },
    {
      id: "aceleracaoAngular.modulo",
      simbolo: "α",
      nome: "Aceleração angular",
      unidade: "rad/s²",
      categoria: "cinematica"
    },
  
    // ==================== DINÂMICA ====================
    {
      id: "massa.modulo",
      simbolo: "m",
      nome: "Massa",
      unidade: "kg",
      categoria: "dinamica"
    },
    {
      id: "forca.modulo",
      simbolo: "F",
      nome: "Força",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "forca.resultante",
      simbolo: "Fᵣ",
      nome: "Força resultante",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "peso.modulo",
      simbolo: "P",
      nome: "Peso",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "forcaNormal.modulo",
      simbolo: "N",
      nome: "Força normal",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "tensao.modulo",
      simbolo: "T",
      nome: "Tração",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "aceleracaoGravidade.modulo",
      simbolo: "g",
      nome: "Aceleração da gravidade",
      unidade: "m/s²",
      categoria: "dinamica"
    },
    {
      id: "constanteElastica.modulo",
      simbolo: "k",
      nome: "Constante elástica",
      unidade: "N/m",
      categoria: "dinamica"
    },
    {
      id: "deformacao.modulo",
      simbolo: "x",
      nome: "Deformação da mola",
      unidade: "m",
      categoria: "dinamica"
    },
    {
      id: "forcaElastica.modulo",
      simbolo: "Fₑ",
      nome: "Força elástica",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "coeficienteAtrito.estatico",
      simbolo: "μₑ",
      nome: "Coeficiente de atrito estático",
      unidade: "adimensional",
      categoria: "dinamica"
    },
    {
      id: "coeficienteAtrito.cinetico",
      simbolo: "μ꜀",
      nome: "Coeficiente de atrito cinético",
      unidade: "adimensional",
      categoria: "dinamica"
    },
    {
      id: "atritoEstatico.modulo",
      simbolo: "fₑ",
      nome: "Força de atrito estático",
      unidade: "N",
      categoria: "dinamica"
    },
    {
      id: "atritoCinetico.modulo",
      simbolo: "f꜀",
      nome: "Força de atrito cinético",
      unidade: "N",
      categoria: "dinamica"
    },
  
    // ==================== ENERGIA ====================
    {
      id: "energiaCinetica.modulo",
      simbolo: "E꜀",
      nome: "Energia cinética",
      unidade: "J",
      categoria: "energia"
    },
    {
      id: "energiaPotencialGravitacional.modulo",
      simbolo: "Eₚ",
      nome: "Energia potencial gravitacional",
      unidade: "J",
      categoria: "energia"
    },
    {
      id: "energiaPotencialElastica.modulo",
      simbolo: "Eₚₑ",
      nome: "Energia potencial elástica",
      unidade: "J",
      categoria: "energia"
    },
    {
      id: "trabalho.modulo",
      simbolo: "W",
      nome: "Trabalho",
      unidade: "J",
      categoria: "energia"
    },
    {
      id: "potencia.modulo",
      simbolo: "P",
      nome: "Potência",
      unidade: "W",
      categoria: "energia"
    },
    {
      id: "altura.modulo",
      simbolo: "h",
      nome: "Altura",
      unidade: "m",
      categoria: "energia"
    },
  
    // ==================== MOMENTO ====================
    {
      id: "momentoLinear.modulo",
      simbolo: "p",
      nome: "Momento linear",
      unidade: "kg·m/s",
      categoria: "momento"
    },
    {
      id: "momentoAngular.modulo",
      simbolo: "L",
      nome: "Momento angular",
      unidade: "kg·m²/s",
      categoria: "momento"
    },
    {
      id: "impulso.modulo",
      simbolo: "J",
      nome: "Impulso",
      unidade: "N·s",
      categoria: "momento"
    },
  
    // ==================== ROTAÇÃO ====================
    {
      id: "torque.modulo",
      simbolo: "τ",
      nome: "Torque",
      unidade: "N·m",
      categoria: "rotacao"
    },
    {
      id: "momentoInercia.modulo",
      simbolo: "I",
      nome: "Momento de inércia",
      unidade: "kg·m²",
      categoria: "rotacao"
    },
    {
      id: "raio.modulo",
      simbolo: "r",
      nome: "Raio",
      unidade: "m",
      categoria: "rotacao"
    },
  
    // ==================== GRAVITAÇÃO ====================
    {
      id: "constanteGravitacional.modulo",
      simbolo: "G",
      nome: "Constante gravitacional",
      unidade: "N·m²/kg²",
      categoria: "gravitacao"
    },
    {
      id: "forcaGravitacional.modulo",
      simbolo: "F₉",
      nome: "Força gravitacional",
      unidade: "N",
      categoria: "gravitacao"
    },
    {
      id: "massaCorpo1.modulo",
      simbolo: "M",
      nome: "Massa do corpo 1",
      unidade: "kg",
      categoria: "gravitacao"
    },
    {
      id: "massaCorpo2.modulo",
      simbolo: "m",
      nome: "Massa do corpo 2",
      unidade: "kg",
      categoria: "gravitacao"
    },
    {
      id: "distancia.modulo",
      simbolo: "r",
      nome: "Distância entre corpos",
      unidade: "m",
      categoria: "gravitacao"
    }
  ];