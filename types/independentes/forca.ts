export interface Forca {
    modulo: number; // F (N)
  }
  
  export interface Peso {
    modulo: number; // P = m·g (N)
  }
  
  export interface ForcaNormal {
    modulo: number; // N (N)
  }
  
  export interface Tensao {
    modulo: number; // T (N)
  }
  
  export interface ForcaResultante {
    modulo: number; // ΣF (N)
  }
  
  export interface ForcaAgregada {
    forca?: Forca;
    peso?: Peso;
    normal?: ForcaNormal;
    tensao?: Tensao;
    resultante?: ForcaResultante;
  }