import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';
import { caveRamp } from '@/lib/colors';

const caveGenerator: TextureGenerator = {
  id: 'cave',
  name: '동굴',
  category: 'terrain',
  description: '거친 벽면 질감의 동굴 내부',
  icon: '🕳️',
  params: [
    ...COMMON_PARAMS,
    { name: 'thresholdLow', label: '하한 임계값', type: 'range', min: 0.1, max: 0.5, default: 0.2, step: 0.05 },
    { name: 'thresholdHigh', label: '상한 임계값', type: 'range', min: 0.3, max: 0.8, default: 0.5, step: 0.05 },
    { name: 'roughness', label: '거칠기', type: 'range', min: 0.1, max: 1, default: 0.5, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);

    const scale = params.scale;
    const thresholdLow = params.thresholdLow as number;
    const thresholdHigh = params.thresholdHigh as number;
    const roughness = params.roughness as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const worleyVal = worley(nx * 4, ny * 4);
        const f1 = worleyVal.f1;

        let value: number;
        if (f1 < thresholdLow) {
          value = 0;
        } else if (f1 < thresholdHigh) {
          const wallBase = (f1 - thresholdLow) / (thresholdHigh - thresholdLow);
          const wallNoise = fbm(nx * 8, ny * 8) * roughness;
          value = wallBase * 0.5 + wallNoise * 0.5 + 0.1;
        } else {
          const outerBase = (f1 - thresholdHigh) / (1 - thresholdHigh);
          const outerNoise = fbm(nx * 4, ny * 4) * roughness * 0.3;
          value = outerBase * 0.4 + outerNoise + 0.5;
        }

        const color = caveRamp(Math.max(0, Math.min(1, value)));

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

export default caveGenerator;
