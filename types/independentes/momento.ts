export interface MomentoLinear {
    modulo: number; // p = m·v (kg·m/s)
  }
  
  export interface MomentoAngular {
    modulo: number; // L = I·ω (kg·m²/s)
  }
  
  export interface Impulso {
    modulo: number; // J = F·Δt (N·s)
  }
  
  export interface MomentoAgregado {
    linear?: MomentoLinear;
    angular?: MomentoAngular;
    impulso?: Impulso;
  }