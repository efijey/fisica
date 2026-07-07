export interface Massa {
    modulo: number; // m (kg)
  }
  
  export interface Densidade {
    modulo: number; // ρ (kg/m³)
  }
  
  export interface MassaAgregada {
    massa: Massa;
    densidade?: Densidade;
  }