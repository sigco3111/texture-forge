import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';
import { leatherRamp } from '@/lib/colors';

const leatherGenerator: TextureGenerator = {
  id: 'leather',
  name: '가죽',
  category: 'material',
  description: '미세한 균열이 있는 자연 가죽 결',
  icon: '👢',
  params: [
    ...COMMON_PARAMS,
    { name: 'grainSize', label: '입자 크기', type: 'range', min: 1, max: 15, default: 6, step: 1 },
    { name: 'crackIntensity', label: '균열 강도', type: 'range', min: 0, max: 1, default: 0.3, step: 0.05 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);

    const scale = params.scale;
    const grainSize = params.grainSize as number;
    const crackIntensity = params.crackIntensity as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const worleyVal = worley(nx * grainSize, ny * grainSize);
        const f1 = worleyVal.f1;

        // Leather grain cells: smooth inside, darker at edges
        const grainValue = 1 - Math.min(1, f1 * 2);

        // Fine fBm texture overlay
        const fineTexture = fbm(nx * 8, ny * 8) * 0.2;

        // Cracks at cell boundaries
        const crackEdge = f1 < crackIntensity * 0.5 ? (crackIntensity * 0.5 - f1) * 4 : 0;
        const crackDarkening = crackEdge * 0.3;

        const value = Math.max(0, Math.min(1, grainValue * 0.7 + fineTexture - crackDarkening + 0.15));
        const color = leatherRamp(value);

        const idx = (y * width + x) * 4;
        buffer[idx] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
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

export default leatherGenerator;
