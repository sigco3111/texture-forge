import type { NoiseFunction2D } from '@/types/noise';

/**
 * Create a domain warping function.
 * Warps input coordinates using noise, returning new coordinates.
 *
 * warp(x, y) = (
 *   x + strength * noise(x, y),
 *   y + strength * noise(x + 5.2, y + 1.3)
 * )
 *
 * Offsets (5.2, 1.3) separate the x and y warp patterns.
 */
export function createDomainWarp(
  noise: NoiseFunction2D,
  strength: number
): (x: number, y: number) => [number, number] {
  return (x: number, y: number): [number, number] => [
    x + strength * noise(x, y),
    y + strength * noise(x + 5.2, y + 1.3),
  ];
}
