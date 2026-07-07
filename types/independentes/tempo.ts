export interface Tempo {
    modulo: number; // t (s)
    inicial?: number; // t0
    final?: number; // tf
    delta?: number; // Δt = tf - t0
  }