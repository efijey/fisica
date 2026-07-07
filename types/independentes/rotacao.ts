export interface Torque {
    modulo: number; // τ = r·F·sin(θ) (N·m)
  }
  
  export interface MomentoInercia {
    modulo: number; // I (kg·m²)
  }
  
  export interface Raio {
    modulo: number; // r (m)
  }
  
  export interface RotacaoAgregada {
    posicaoAngular?: import('./posicao').PosicaoAngular;
    velocidadeAngular?: import('./velocidade').VelocidadeAngular;
    aceleracaoAngular?: import('./aceleracao').AceleracaoAngular;
    torque?: Torque;
    momentoInercia?: MomentoInercia;
    raio?: Raio;
  }