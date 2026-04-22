import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';
import { rustRamp } from '@/lib/colors';

const rustGenerator: TextureGenerator = {
  id: 'rust',
  name: '녹',
  category: 'material',
  description: '반점 모양의 부식된 금속',
  icon: '🔧',
  params: [
    ...COMMON_PARAMS,
    { name: 'rustLevel', label: '부식 정도', type: 'range', min: 0, max: 1, default: 0.5, step: 0.05 },
    { name: 'patchSize', label: '반점 크기', type: 'range', min: 1, max: 20, default: 8, step: 1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);

    const scale = params.scale;
    const rustLevel = params.rustLevel as number;
    const patchSize = params.patchSize as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const worleyVal = worley(nx * patchSize, ny * patchSize);
        const f1 = worleyVal.f1;

        // Threshold-based rust/metal split
        const isRust = f1 < rustLevel;
        const detail = fbm(nx * 3, ny * 3) * 0.3;

        let value: number;
        if (isRust) {
          value = 0.3 + f1 / rustLevel * 0.4 + detail;
        } else {
          value = 0.7 + detail * 0.5;
        }

        const color = rustRamp(Math.max(0, Math.min(1, value)));

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

export default rustGenerator;
