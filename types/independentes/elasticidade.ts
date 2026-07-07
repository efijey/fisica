export interface ConstanteElastica {
    modulo: number; // k (N/m)
  }
  
  export interface Deformacao {
    modulo: number; // x ou Δx (m)
  }
  
  export interface ForcaElastica {
    modulo: number; // Fe = k·x (N)
  }
  
  export interface ElasticidadeAgregada {
    constante: ConstanteElastica;
    deformacao?: Deformacao;
    forca?: ForcaElastica;
  }