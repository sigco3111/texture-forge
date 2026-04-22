import type { NoiseFunction2D } from '@/types/noise';

const MAX_OCTAVES = 8;

/**
 * Create a Turbulence function (absolute-value fBm).
 * Same as fBm but applies Math.abs() to each octave's noise value.
 * Output range is [0, 1].
 */
export function createTurbulence(
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
      total += amplitude * Math.abs(noise(x * frequency, y * frequency));
      maxValue += amplitude;
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    return total / maxValue;
  };
}
