export interface Aceleracao {
    modulo: number; // a (m/s²)
    inicial?: number; // a0
    tangencial?: number; // at
    centripeta?: number; // ac = v²/r
  }
  
  export interface AceleracaoAngular {
    modulo: number; // α (rad/s²)
    inicial?: number; // α0
  }
  
  export interface AceleracaoGravidade {
    modulo: number; // g ≈ 9.8 m/s²
  }
  
  export interface AceleracaoBidimensional {
    x: Aceleracao;
    y: Aceleracao;
  }