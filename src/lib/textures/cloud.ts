import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { cloudRamp } from '@/lib/colors';

const cloudGenerator: TextureGenerator = {
  id: 'cloud',
  name: '구름',
  category: 'weather',
  description: '투명도가 있는 절차적 구름',
  icon: '☁️',
  params: [
    ...COMMON_PARAMS,
    { name: 'threshold', label: '임계값', type: 'range', min: 0, max: 1, default: 0.3, step: 0.05 },
    { name: 'coverage', label: '적용 범위', type: 'range', min: 0, max: 1, default: 0.5, step: 0.05 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const threshold = params.threshold as number;
    const coverage = params.coverage as number;

    const adjustedThreshold = threshold - coverage * 0.5;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const value = fbm(nx, ny);

        const idx = (y * width + x) * 4;

        if (value > adjustedThreshold) {
          const normalized = (value - adjustedThreshold) / (1 - adjustedThreshold);
          const color = cloudRamp(normalized);
          const alpha = Math.min(255, Math.floor(normalized * 255 * 1.5));
          buffer[idx] = color[0];
          buffer[idx + 1] = color[1];
          buffer[idx + 2] = color[2];
          buffer[idx + 3] = alpha;
        } else {
          buffer[idx] = 0;
          buffer[idx + 1] = 0;
          buffer[idx + 2] = 0;
          buffer[idx + 3] = 0;
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

export default cloudGenerator;
