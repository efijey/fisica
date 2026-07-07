export interface EnergiaCinetica {
    modulo: number; // Ec = ½·m·v² (J)
  }
  
  export interface EnergiaPotencialGravitacional {
    modulo: number; // Epg = m·g·h (J)
  }
  
  export interface EnergiaPotencialElastica {
    modulo: number; // Epe = ½·k·x² (J)
  }
  
  export interface Trabalho {
    modulo: number; // W = F·d·cos(θ) (J)
  }
  
  export interface Potencia {
    modulo: number; // P = W/t (W)
  }
  
  export interface Altura {
    modulo: number; // h (m)
  }
  
  export interface EnergiaAgregada {
    cinetica?: EnergiaCinetica;
    potencialGravitacional?: EnergiaPotencialGravitacional;
    potencialElastica?: EnergiaPotencialElastica;
    mecanica?: number; // Em = Ec + Ep (J)
    trabalho?: Trabalho;
    potencia?: Potencia;
  }