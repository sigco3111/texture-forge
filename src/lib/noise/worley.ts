export interface WorleyResult {
  f1: number; // distance to nearest feature point
  f2: number; // distance to 2nd nearest feature point
}

/**
 * Integer hash combining cell coordinates and seed into a pseudo-random value.
 * Uses a cascade of xorshift/multiply steps for good avalanche behavior.
 */
function hashCell(x: number, y: number, seed: number): number {
  let h = seed;
  h ^= x * 0x45d9f3b + 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  h ^= y * 0x45d9f3b + 0x9e3779b9;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
  h ^= h >>> 16;
  return h >>> 0;
}

function hashToFloat(hash: number): number {
  return (hash >>> 0) / 4294967296;
}

function getFeaturePoint(
  cx: number,
  cy: number,
  seed: number
): [number, number] {
  const h1 = hashCell(cx, cy, seed);
  const h2 = hashCell(cx, cy, seed ^ 0x517cc1b7);
  return [hashToFloat(h1), hashToFloat(h2)];
}

export function createWorleyNoise(
  seed: number
): (x: number, y: number) => WorleyResult {
  return (x: number, y: number): WorleyResult => {
    const cx = Math.floor(x);
    const cy = Math.floor(y);

    let f1 = Infinity;
    let f2 = Infinity;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const nx = cx + dx;
        const ny = cy + dy;

        const [fx, fy] = getFeaturePoint(nx, ny, seed);

        const px = nx + fx;
        const py = ny + fy;

        const distSq = (x - px) * (x - px) + (y - py) * (y - py);

        if (distSq < f1) {
          f2 = f1;
          f1 = distSq;
        } else if (distSq < f2) {
          f2 = distSq;
        }
      }
    }

    return {
      f1: Math.sqrt(f1),
      f2: Math.sqrt(f2),
    };
  };
}
