import type { NoiseFunction2D } from '@/types/noise';

const MAX_OCTAVES = 8;

/**
 * Create a Fractal Brownian Motion function.
 * Accumulates multiple octaves of noise with decreasing amplitude.
 */
export function createFBM(
  noise: NoiseFunction2D,
  octaves: number,
  persistence: number,
  lacunarity: number
): (x: number, y: number) => number {
  const clampedOctaves = Math.min(Math.max(1, octaves), MAX_OCTAVES);

  return (x: number, y: number): number => {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < clampedOctaves; i++) {
      total += amplitude * noise(x * frequency, y * frequency);
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  };
}
