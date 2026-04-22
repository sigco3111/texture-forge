import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';
import { createDomainWarp } from '@/lib/noise/domain-warp';

const tileColor: [number, number, number] = [200, 195, 185];
const groutColor: [number, number, number] = [60, 55, 50];

const tileGenerator: TextureGenerator = {
  id: 'tile',
  name: '타일',
  category: 'geometric',
  description: '그라우트와 노화 균열이 있는 정규 타일 그리드',
  icon: '🔲',
  params: [
    ...COMMON_PARAMS,
    { name: 'tileSize', label: '타일 크기', type: 'range', min: 20, max: 80, default: 40, step: 1 },
    { name: 'groutWidth', label: '줄눈 너비', type: 'range', min: 1, max: 5, default: 2, step: 1 },
    { name: 'crackIntensity', label: '균열 강도', type: 'range', min: 0, max: 1, default: 0.3, step: 0.05 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);
    const warp = createDomainWarp(noise, params.crackIntensity as number * 0.5);

    const scale = params.scale;
    const tileSize = params.tileSize as number;
    const groutWidth = params.groutWidth as number;
    const crackIntensity = params.crackIntensity as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        // Grid-based tile detection
        const tileX = x % tileSize;
        const tileY = y % tileSize;
        const isGrout = tileX < groutWidth || tileY < groutWidth;

        // Tile color variation per tile cell
        const cellX = Math.floor(x / tileSize);
        const cellY = Math.floor(y / tileSize);
        const cellVariation = noise(cellX * 0.3, cellY * 0.3) * 0.15;

        // Worley F1 for grout roughness and aging cracks
        const [wx, wy] = warp(nx, ny);
        const worleyVal = worley(wx * scale * 0.05, wy * scale * 0.05);
        const crackDarkening = worleyVal.f1 * crackIntensity * 0.3;

        let r: number, g: number, b: number;
        if (isGrout) {
          const roughness = fbm(nx * 20, ny * 20) * 0.2;
          r = groutColor[0] + roughness * 30;
          g = groutColor[1] + roughness * 25;
          b = groutColor[2] + roughness * 20;
        } else {
          const fineNoise = fbm(nx * 15, ny * 15) * 0.1;
          r = tileColor[0] + (cellVariation + fineNoise - crackDarkening) * 80;
          g = tileColor[1] + (cellVariation + fineNoise - crackDarkening) * 80;
          b = tileColor[2] + (cellVariation + fineNoise - crackDarkening) * 80;
        }

        const idx = (y * width + x) * 4;
        buffer[idx] = Math.max(0, Math.min(255, r));
        buffer[idx + 1] = Math.max(0, Math.min(255, g));
        buffer[idx + 2] = Math.max(0, Math.min(255, b));
        buffer[idx + 3] = 255;
      }
    }

    return new ImageData(new Uint8ClampedArray(buffer), width, height);
  },

  generateThumbnail(): ImageData {
    const defaults = createDefaultParams(this.params) as GenerationParams;
    return this.generate(64, 64, { ...defaults, seed: 42 });
  },
};

export default tileGenerator;
