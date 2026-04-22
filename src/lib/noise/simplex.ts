import { createNoise2D, createNoise3D } from 'simplex-noise';
import alea from 'alea';
import type { NoiseFunction2D, NoiseFunction3D } from '@/types/noise';

export function createSeededNoise2D(seed: number): NoiseFunction2D {
  const prng = alea(seed.toString());
  return createNoise2D(prng);
}

export function createSeededNoise3D(seed: number): NoiseFunction3D {
  const prng = alea(seed.toString());
  return createNoise3D(prng);
}
