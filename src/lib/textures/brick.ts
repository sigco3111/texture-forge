import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';

const MORTAR_COLOR: [number, number, number] = [80, 75, 70];
const BRICK_BASE: [number, number, number] = [160, 60, 40];

const brickGenerator: TextureGenerator = {
  id: 'brick',
  name: '벽돌',
  category: 'geometric',
  description: '모르타르가 있는 절차적 벽돌 벽',
  icon: '🧱',
  params: [
    ...COMMON_PARAMS,
    { name: 'brickWidth', label: '벽돌 너비', type: 'range', min: 20, max: 100, default: 50, step: 1 },
    { name: 'brickHeight', label: '벽돌 높이', type: 'range', min: 10, max: 50, default: 25, step: 1 },
    { name: 'mortarSize', label: '모르타르 크기', type: 'range', min: 1, max: 5, default: 2, step: 1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);

    const brickWidth = params.brickWidth as number;
    const brickHeight = params.brickHeight as number;
    const mortarSize = params.mortarSize as number;
    const scale = params.scale;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const row = Math.floor(y / brickHeight);
        const offsetX = (row % 2 === 0) ? 0 : brickWidth / 2;

        const localX = (x + offsetX) % brickWidth;
        const localY = y % brickHeight;

        const halfMortar = mortarSize / 2;
        const isInMortar = localX < halfMortar || localX > brickWidth - halfMortar
          || localY < halfMortar || localY > brickHeight - halfMortar;

        const idx = (y * width + x) * 4;

        if (isInMortar) {
          buffer[idx] = MORTAR_COLOR[0];
          buffer[idx + 1] = MORTAR_COLOR[1];
          buffer[idx + 2] = MORTAR_COLOR[2];
          buffer[idx + 3] = 255;
        } else {
          const nx = x / width * scale * 0.01;
          const ny = y / height * scale * 0.01;

          const noiseValue = fbm(nx * 5, ny * 5) * 0.3;
          const aging = worley(nx * 3, ny * 3).f1 * 0.15;

          const variation = noiseValue + aging;

          buffer[idx] = Math.max(0, Math.min(255, BRICK_BASE[0] + variation * 80));
          buffer[idx + 1] = Math.max(0, Math.min(255, BRICK_BASE[1] + variation * 40));
          buffer[idx + 2] = Math.max(0, Math.min(255, BRICK_BASE[2] + variation * 30));
          buffer[idx + 3] = 255;
        }
      }
    }

    return new ImageData(new Uint8ClampedArray(buffer), width, height);
  },

  generateThumbnail(): ImageData {
    const defaults = createDefaultParams(this.params) as GenerationParams;
    return this.generate(64, 64, { ...defaults, seed: 42 });
  },
};

export default brickGenerator;
