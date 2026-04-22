import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { carpetRamp } from '@/lib/colors';

const carpetGenerator: TextureGenerator = {
  id: 'carpet',
  name: '카펫',
  category: 'geometric',
  description: '색상 변화가 있는 밀집 방향성 파일',
  icon: '🟫',
  params: [
    ...COMMON_PARAMS,
    { name: 'pileLength', label: '파일 길이', type: 'range', min: 0.5, max: 5, default: 2, step: 0.1 },
    { name: 'density', label: '밀도', type: 'range', min: 5, max: 50, default: 25, step: 1 },
    { name: 'colorSpread', label: '색상 분산', type: 'range', min: 0, max: 40, default: 15, step: 1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const pileLength = params.pileLength as number;
    const density = params.density as number;
    const colorSpread = params.colorSpread as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const pileX = nx * density;
        const pileY = ny * density * pileLength;
        const pileNoise = fbm(pileX, pileY);

        const colorVar = fbm(nx * 2, ny * 2) * (colorSpread / 100);

        const value = (pileNoise + 1) * 0.5 + colorVar;
        const color = carpetRamp(Math.max(0, Math.min(1, value)));

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

export default carpetGenerator;
