export interface ConstanteGravitacional {
    modulo: 6.674e-11; // G (N·m²/kg²) — valor fixo
  }
  
  export interface ForcaGravitacional {
    modulo: number; // Fg = G·M·m/r² (N)
  }
  
  export interface GravitacaoAgregada {
    constante: ConstanteGravitacional;
    massaCorpo1: import('./massa').Massa; // M
    massaCorpo2: import('./massa').Massa; // m
    distancia: import('./posicao').Posicao; // r
    forca?: ForcaGravitacional;
  }