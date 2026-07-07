export interface Velocidade {
    modulo: number; // v (m/s)
    inicial?: number; // v0
    final?: number; // vf
    media?: number; // vm = Δs/Δt
  }
  
  export interface VelocidadeAngular {
    modulo: number; // ω (rad/s)
    inicial?: number; // ω0
    final?: number; // ωf
    media?: number; // ωm
  }
  
  export interface VelocidadeBidimensional {
    x: Velocidade;
    y: Velocidade;
  }