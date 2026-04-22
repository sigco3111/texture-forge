import type { NoiseFunction2D } from '@/types/noise';

const GRADIENTS: [number, number][] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number): number {
  return a + t * (b - a);
}

function dot2(g: [number, number], x: number, y: number): number {
  return g[0] * x + g[1] * y;
}

function buildPermutationTable(seed: number): Uint8Array {
  const rng = seededRandom(seed);
  const p = Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 256; i++) {
    perm[i] = p[i];
    perm[i + 256] = p[i];
  }
  return perm;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function createPerlinNoise2D(seed: number): NoiseFunction2D {
  const perm = buildPermutationTable(seed);

  return (x: number, y: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = fade(xf);
    const v = fade(yf);

    const aa = perm[perm[xi] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const ba = perm[perm[xi + 1] + yi];
    const bb = perm[perm[xi + 1] + yi + 1];

    const g00 = GRADIENTS[aa % 8];
    const g10 = GRADIENTS[ba % 8];
    const g01 = GRADIENTS[ab % 8];
    const g11 = GRADIENTS[bb % 8];

    const n00 = dot2(g00, xf, yf);
    const n10 = dot2(g10, xf - 1, yf);
    const n01 = dot2(g01, xf, yf - 1);
    const n11 = dot2(g11, xf - 1, yf - 1);

    const nx0 = lerp(n00, n10, u);
    const nx1 = lerp(n01, n11, u);

    return lerp(nx0, nx1, v);
  };
}
