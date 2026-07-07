// physics/formulas/catalog.ts

export interface VariacaoFormula {
    isola: string;           // id da variável que esta forma resolve
    expressao: string;       // expressão já isolada nessa variável
    expressaoLatex?: string;
  }
  
  export interface Formula {
    id: string;
    nome: string;
    expressaoPrincipal: string;   // forma canônica/mais conhecida
    variacoes: VariacaoFormula[]; // todas as formas isoladas
    area: AreaFisica;
    variaveis: string[];          // para o motor de inferência (não muda)
    descricao?: string;
  }
  
  export type AreaFisica =
    | "cinematica"
    | "dinamica"
    | "energia"
    | "rotacao"
    | "gravitacao"
    | "momento";
  
  export const catalogoFormulas: Formula[] = [
  
    // ==================== CINEMÁTICA ====================
    {
      id: "velocidade_media",
      nome: "Velocidade média",
      expressaoPrincipal: "Vm = ΔS / Δt",
      area: "cinematica",
      variaveis: ["velocidade.media", "posicao.delta", "tempo.delta"],
      descricao: "Razão entre o deslocamento e o intervalo de tempo.",
      variacoes: [
        { isola: "velocidade.media", expressao: "Vm = ΔS / Δt" },
        { isola: "posicao.delta",    expressao: "ΔS = Vm · Δt" },
        { isola: "tempo.delta",      expressao: "Δt = ΔS / Vm" },
      ]
    },
  
    {
      id: "mru_posicao_final",
      nome: "Posição final (MRU)",
      expressaoPrincipal: "s = s₀ + v·t",
      area: "cinematica",
      variaveis: ["posicao.final", "posicao.inicial", "velocidade.modulo", "tempo.modulo"],
      descricao: "Equação horária da posição no movimento retilíneo uniforme.",
      variacoes: [
        { isola: "posicao.final",      expressao: "s = s₀ + v·t" },
        { isola: "posicao.inicial",    expressao: "s₀ = s - v·t" },
        { isola: "velocidade.modulo",  expressao: "v = (s - s₀) / t" },
        { isola: "tempo.modulo",       expressao: "t = (s - s₀) / v" },
      ]
    },
  
    {
      id: "mruv_velocidade_final",
      nome: "Velocidade final (MRUV)",
      expressaoPrincipal: "v = v₀ + a·t",
      area: "cinematica",
      variaveis: ["velocidade.final", "velocidade.inicial", "aceleracao.modulo", "tempo.modulo"],
      descricao: "Equação horária da velocidade no movimento retilíneo uniformemente variado.",
      variacoes: [
        { isola: "velocidade.final",   expressao: "v = v₀ + a·t" },
        { isola: "velocidade.inicial", expressao: "v₀ = v - a·t" },
        { isola: "aceleracao.modulo",  expressao: "a = (v - v₀) / t" },
        { isola: "tempo.modulo",       expressao: "t = (v - v₀) / a" },
      ]
    },
  
    {
      id: "mruv_posicao_final",
      nome: "Posição final (MRUV)",
      expressaoPrincipal: "s = s₀ + v₀·t + ½·a·t²",
      area: "cinematica",
      variaveis: ["posicao.final", "posicao.inicial", "velocidade.inicial", "aceleracao.modulo", "tempo.modulo"],
      descricao: "Equação horária da posição no MRUV.",
      variacoes: [
        { isola: "posicao.final",      expressao: "s = s₀ + v₀·t + ½·a·t²" },
        { isola: "posicao.inicial",    expressao: "s₀ = s - v₀·t - ½·a·t²" },
        { isola: "velocidade.inicial", expressao: "v₀ = (s - s₀ - ½·a·t²) / t" },
        { isola: "aceleracao.modulo",  expressao: "a = 2·(s - s₀ - v₀·t) / t²" },
      ]
    },
  
    {
      id: "torricelli",
      nome: "Equação de Torricelli",
      expressaoPrincipal: "v² = v₀² + 2·a·ΔS",
      area: "cinematica",
      variaveis: ["velocidade.final", "velocidade.inicial", "aceleracao.modulo", "posicao.delta"],
      descricao: "Relaciona velocidade, aceleração e deslocamento sem depender do tempo.",
      variacoes: [
        { isola: "velocidade.final",   expressao: "v = √(v₀² + 2·a·ΔS)" },
        { isola: "velocidade.inicial", expressao: "v₀ = √(v² - 2·a·ΔS)" },
        { isola: "aceleracao.modulo",  expressao: "a = (v² - v₀²) / (2·ΔS)" },
        { isola: "posicao.delta",      expressao: "ΔS = (v² - v₀²) / (2·a)" },
      ]
    },
  
    {
      id: "aceleracao_centripeta",
      nome: "Aceleração centrípeta",
      expressaoPrincipal: "ac = v² / r",
      area: "cinematica",
      variaveis: ["aceleracao.centripeta", "velocidade.modulo", "raio.modulo"],
      descricao: "Aceleração que aponta para o centro da trajetória circular.",
      variacoes: [
        { isola: "aceleracao.centripeta", expressao: "ac = v² / r" },
        { isola: "velocidade.modulo",     expressao: "v = √(ac · r)" },
        { isola: "raio.modulo",           expressao: "r = v² / ac" },
      ]
    },
  
    {
      id: "velocidade_angular_media",
      nome: "Velocidade angular média",
      expressaoPrincipal: "ω = Δθ / Δt",
      area: "cinematica",
      variaveis: ["velocidadeAngular.modulo", "posicaoAngular.delta", "tempo.delta"],
      descricao: "Razão entre o deslocamento angular e o intervalo de tempo.",
      variacoes: [
        { isola: "velocidadeAngular.modulo", expressao: "ω = Δθ / Δt" },
        { isola: "posicaoAngular.delta",     expressao: "Δθ = ω · Δt" },
        { isola: "tempo.delta",              expressao: "Δt = Δθ / ω" },
      ]
    },
  
    {
      id: "relacao_v_omega",
      nome: "Relação entre v e ω",
      expressaoPrincipal: "v = ω · r",
      area: "cinematica",
      variaveis: ["velocidade.modulo", "velocidadeAngular.modulo", "raio.modulo"],
      descricao: "Converte velocidade angular em velocidade linear.",
      variacoes: [
        { isola: "velocidade.modulo",        expressao: "v = ω · r" },
        { isola: "velocidadeAngular.modulo", expressao: "ω = v / r" },
        { isola: "raio.modulo",              expressao: "r = v / ω" },
      ]
    },
  
    {
      id: "mcu_velocidade_angular_final",
      nome: "Velocidade angular final (MCUV)",
      expressaoPrincipal: "ω = ω₀ + α·t",
      area: "cinematica",
      variaveis: ["velocidadeAngular.final", "velocidadeAngular.inicial", "aceleracaoAngular.modulo", "tempo.modulo"],
      descricao: "Equação horária da velocidade angular no MCUV.",
      variacoes: [
        { isola: "velocidadeAngular.final",   expressao: "ω = ω₀ + α·t" },
        { isola: "velocidadeAngular.inicial", expressao: "ω₀ = ω - α·t" },
        { isola: "aceleracaoAngular.modulo",  expressao: "α = (ω - ω₀) / t" },
        { isola: "tempo.modulo",              expressao: "t = (ω - ω₀) / α" },
      ]
    },
  
    // ==================== DINÂMICA ====================
    {
      id: "segunda_lei_newton",
      nome: "Segunda Lei de Newton",
      expressaoPrincipal: "F = m · a",
      area: "dinamica",
      variaveis: ["forca.resultante", "massa.modulo", "aceleracao.modulo"],
      descricao: "A força resultante é igual ao produto da massa pela aceleração.",
      variacoes: [
        { isola: "forca.resultante",  expressao: "F = m · a" },
        { isola: "massa.modulo",      expressao: "m = F / a" },
        { isola: "aceleracao.modulo", expressao: "a = F / m" },
      ]
    },
  
    {
      id: "forca_peso",
      nome: "Força peso",
      expressaoPrincipal: "P = m · g",
      area: "dinamica",
      variaveis: ["peso.modulo", "massa.modulo", "aceleracaoGravidade.modulo"],
      descricao: "Força gravitacional exercida pela Terra sobre um corpo próximo à superfície.",
      variacoes: [
        { isola: "peso.modulo",               expressao: "P = m · g" },
        { isola: "massa.modulo",              expressao: "m = P / g" },
        { isola: "aceleracaoGravidade.modulo", expressao: "g = P / m" },
      ]
    },
  
    {
      id: "forca_elastica",
      nome: "Lei de Hooke",
      expressaoPrincipal: "Fe = k · x",
      area: "dinamica",
      variaveis: ["forcaElastica.modulo", "constanteElastica.modulo", "deformacao.modulo"],
      descricao: "Força restauradora de uma mola proporcional à deformação.",
      variacoes: [
        { isola: "forcaElastica.modulo",    expressao: "Fe = k · x" },
        { isola: "constanteElastica.modulo", expressao: "k = Fe / x" },
        { isola: "deformacao.modulo",        expressao: "x = Fe / k" },
      ]
    },
  
    {
      id: "atrito_cinetico",
      nome: "Atrito cinético",
      expressaoPrincipal: "fc = μc · N",
      area: "dinamica",
      variaveis: ["atritoCinetico.modulo", "coeficienteAtrito.cinetico", "forcaNormal.modulo"],
      descricao: "Força de atrito durante o deslizamento entre duas superfícies.",
      variacoes: [
        { isola: "atritoCinetico.modulo",      expressao: "fc = μc · N" },
        { isola: "coeficienteAtrito.cinetico", expressao: "μc = fc / N" },
        { isola: "forcaNormal.modulo",         expressao: "N = fc / μc" },
      ]
    },
  
    {
      id: "atrito_estatico_maximo",
      nome: "Atrito estático máximo",
      expressaoPrincipal: "fe = μe · N",
      area: "dinamica",
      variaveis: ["atritoEstatico.modulo", "coeficienteAtrito.estatico", "forcaNormal.modulo"],
      descricao: "Força de atrito estático máxima antes do corpo entrar em movimento.",
      variacoes: [
        { isola: "atritoEstatico.modulo",      expressao: "fe = μe · N" },
        { isola: "coeficienteAtrito.estatico", expressao: "μe = fe / N" },
        { isola: "forcaNormal.modulo",         expressao: "N = fe / μe" },
      ]
    },
  
    // ==================== ENERGIA ====================
    {
      id: "energia_cinetica",
      nome: "Energia cinética",
      expressaoPrincipal: "Ec = ½ · m · v²",
      area: "energia",
      variaveis: ["energiaCinetica.modulo", "massa.modulo", "velocidade.modulo"],
      descricao: "Energia associada ao movimento de um corpo.",
      variacoes: [
        { isola: "energiaCinetica.modulo", expressao: "Ec = ½ · m · v²" },
        { isola: "massa.modulo",           expressao: "m = 2·Ec / v²" },
        { isola: "velocidade.modulo",      expressao: "v = √(2·Ec / m)" },
      ]
    },
  
    {
      id: "energia_potencial_gravitacional",
      nome: "Energia potencial gravitacional",
      expressaoPrincipal: "Ep = m · g · h",
      area: "energia",
      variaveis: ["energiaPotencialGravitacional.modulo", "massa.modulo", "aceleracaoGravidade.modulo", "altura.modulo"],
      descricao: "Energia associada à posição de um corpo em um campo gravitacional.",
      variacoes: [
        { isola: "energiaPotencialGravitacional.modulo", expressao: "Ep = m · g · h" },
        { isola: "massa.modulo",                          expressao: "m = Ep / (g · h)" },
        { isola: "aceleracaoGravidade.modulo",            expressao: "g = Ep / (m · h)" },
        { isola: "altura.modulo",                         expressao: "h = Ep / (m · g)" },
      ]
    },
  
    {
      id: "energia_potencial_elastica",
      nome: "Energia potencial elástica",
      expressaoPrincipal: "Epe = ½ · k · x²",
      area: "energia",
      variaveis: ["energiaPotencialElastica.modulo", "constanteElastica.modulo", "deformacao.modulo"],
      descricao: "Energia armazenada em uma mola deformada.",
      variacoes: [
        { isola: "energiaPotencialElastica.modulo", expressao: "Epe = ½ · k · x²" },
        { isola: "constanteElastica.modulo",         expressao: "k = 2·Epe / x²" },
        { isola: "deformacao.modulo",                expressao: "x = √(2·Epe / k)" },
      ]
    },
  
    {
      id: "trabalho_forca_constante",
      nome: "Trabalho de força constante",
      expressaoPrincipal: "W = F · d",
      area: "energia",
      variaveis: ["trabalho.modulo", "forca.modulo", "posicao.delta"],
      descricao: "Trabalho realizado por uma força constante paralela ao deslocamento.",
      variacoes: [
        { isola: "trabalho.modulo",   expressao: "W = F · d" },
        { isola: "forca.modulo",      expressao: "F = W / d" },
        { isola: "posicao.delta",     expressao: "d = W / F" },
      ]
    },
  
    {
      id: "potencia_trabalho",
      nome: "Potência",
      expressaoPrincipal: "P = W / t",
      area: "energia",
      variaveis: ["potencia.modulo", "trabalho.modulo", "tempo.modulo"],
      descricao: "Taxa de realização de trabalho ao longo do tempo.",
      variacoes: [
        { isola: "potencia.modulo", expressao: "P = W / t" },
        { isola: "trabalho.modulo", expressao: "W = P · t" },
        { isola: "tempo.modulo",    expressao: "t = W / P" },
      ]
    },
  
    {
      id: "potencia_forca_velocidade",
      nome: "Potência (força e velocidade)",
      expressaoPrincipal: "P = F · v",
      area: "energia",
      variaveis: ["potencia.modulo", "forca.modulo", "velocidade.modulo"],
      descricao: "Potência instantânea como produto da força pela velocidade.",
      variacoes: [
        { isola: "potencia.modulo",   expressao: "P = F · v" },
        { isola: "forca.modulo",      expressao: "F = P / v" },
        { isola: "velocidade.modulo", expressao: "v = P / F" },
      ]
    },
  
    // ==================== MOMENTO ====================
    {
      id: "momento_linear",
      nome: "Momento linear",
      expressaoPrincipal: "p = m · v",
      area: "momento",
      variaveis: ["momentoLinear.modulo", "massa.modulo", "velocidade.modulo"],
      descricao: "Quantidade de movimento de um corpo.",
      variacoes: [
        { isola: "momentoLinear.modulo", expressao: "p = m · v" },
        { isola: "massa.modulo",          expressao: "m = p / v" },
        { isola: "velocidade.modulo",     expressao: "v = p / m" },
      ]
    },
  
    {
      id: "impulso_forca",
      nome: "Impulso de uma força",
      expressaoPrincipal: "J = F · Δt",
      area: "momento",
      variaveis: ["impulso.modulo", "forca.modulo", "tempo.delta"],
      descricao: "Produto da força pelo intervalo de tempo de aplicação.",
      variacoes: [
        { isola: "impulso.modulo", expressao: "J = F · Δt" },
        { isola: "forca.modulo",   expressao: "F = J / Δt" },
        { isola: "tempo.delta",    expressao: "Δt = J / F" },
      ]
    },
  
    {
      id: "teorema_impulso",
      nome: "Teorema do impulso",
      expressaoPrincipal: "J = Δp",
      area: "momento",
      variaveis: ["impulso.modulo", "momentoLinear.modulo"],
      descricao: "O impulso é igual à variação do momento linear.",
      variacoes: [
        { isola: "impulso.modulo",       expressao: "J = Δp" },
        { isola: "momentoLinear.modulo", expressao: "Δp = J" },
      ]
    },
  
    // ==================== ROTAÇÃO ====================
    {
      id: "torque_forca",
      nome: "Torque",
      expressaoPrincipal: "τ = r · F",
      area: "rotacao",
      variaveis: ["torque.modulo", "raio.modulo", "forca.modulo"],
      descricao: "Momento de uma força em relação a um eixo.",
      variacoes: [
        { isola: "torque.modulo", expressao: "τ = r · F" },
        { isola: "raio.modulo",   expressao: "r = τ / F" },
        { isola: "forca.modulo",  expressao: "F = τ / r" },
      ]
    },
  
    {
      id: "segunda_lei_rotacao",
      nome: "Segunda Lei de Newton (rotação)",
      expressaoPrincipal: "τ = I · α",
      area: "rotacao",
      variaveis: ["torque.modulo", "momentoInercia.modulo", "aceleracaoAngular.modulo"],
      descricao: "O torque resultante é igual ao produto do momento de inércia pela aceleração angular.",
      variacoes: [
        { isola: "torque.modulo",              expressao: "τ = I · α" },
        { isola: "momentoInercia.modulo",      expressao: "I = τ / α" },
        { isola: "aceleracaoAngular.modulo",   expressao: "α = τ / I" },
      ]
    },
  
    {
      id: "momento_angular",
      nome: "Momento angular",
      expressaoPrincipal: "L = I · ω",
      area: "rotacao",
      variaveis: ["momentoAngular.modulo", "momentoInercia.modulo", "velocidadeAngular.modulo"],
      descricao: "Quantidade de movimento angular de um corpo em rotação.",
      variacoes: [
        { isola: "momentoAngular.modulo",     expressao: "L = I · ω" },
        { isola: "momentoInercia.modulo",     expressao: "I = L / ω" },
        { isola: "velocidadeAngular.modulo",  expressao: "ω = L / I" },
      ]
    },
  
    // ==================== GRAVITAÇÃO ====================
    {
      id: "forca_gravitacional",
      nome: "Lei da Gravitação Universal",
      expressaoPrincipal: "Fg = G · M · m / r²",
      area: "gravitacao",
      variaveis: ["forcaGravitacional.modulo", "constanteGravitacional.modulo", "massaCorpo1.modulo", "massaCorpo2.modulo", "distancia.modulo"],
      descricao: "Força de atração entre duas massas separadas por uma distância r.",
      variacoes: [
        { isola: "forcaGravitacional.modulo",    expressao: "Fg = G · M · m / r²" },
        { isola: "massaCorpo1.modulo",           expressao: "M = Fg · r² / (G · m)" },
        { isola: "massaCorpo2.modulo",           expressao: "m = Fg · r² / (G · M)" },
        { isola: "distancia.modulo",             expressao: "r = √(G · M · m / Fg)" },
      ]
    },
  ];