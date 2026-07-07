export interface CoeficienteAtrito {
    estatico: number; // μe (adimensional)
    cinetico: number; // μc (adimensional)
  }
  
  export interface ForcaAtrito {
    modulo: number; // f (N)
  }
  
  export interface AtritoEstatico {
    modulo: number; // fe ≤ μe · N (N)
  }
  
  export interface AtritoCinetico {
    modulo: number; // fc = μc · N (N)
  }
  
  export interface AtritoAgregado {
    coeficiente?: CoeficienteAtrito;
    estatico?: AtritoEstatico;
    cinetico?: AtritoCinetico;
  }