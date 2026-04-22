import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createWorleyNoise } from '@/lib/noise/worley';
import { graniteRamp } from '@/lib/colors';

const graniteGenerator: TextureGenerator = {
  id: 'granite',
  name: '화강암',
  category: 'nature',
  description: '색상 변화가 있는 세립 화강암 결',
  icon: '🪨',
  params: [
    ...COMMON_PARAMS,
    { name: 'grainScale', label: '입자 크기', type: 'range', min: 1, max: 20, default: 8, step: 1 },
    { name: 'contrast', label: '대비', type: 'range', min: 0.5, max: 3, default: 1.5, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);
    const worley = createWorleyNoise(params.seed);

    const scale = params.scale;
    const grainScale = params.grainScale as number;
    const contrast = params.contrast as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const worleyVal = worley(nx * grainScale, ny * grainScale);
        const f1 = worleyVal.f1;

        const colorVariation = fbm(nx * 2, ny * 2) * 0.3;
        const value = Math.pow(Math.max(0, Math.min(1, f1 * contrast)) + colorVariation, 1);

        const color = graniteRamp(Math.max(0, Math.min(1, value)));

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

export default graniteGenerator;
