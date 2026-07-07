export interface Posicao {
    modulo: number; // s ou x (m)
    inicial?: number; // s0 ou x0
    final?: number; // sf ou xf
    delta?: number; // Δs = sf - s0
  }
  
  export interface PosicaoAngular {
    modulo: number; // θ (rad)
    inicial?: number; // θ0
    final?: number; // θf
    delta?: number; // Δθ
  }
  
  export interface PosicaoBidimensional {
    x: Posicao;
    y: Posicao;
  }
  
  export interface PosicaoTridimensional {
    x: Posicao;
    y: Posicao;
    z: Posicao;
  }