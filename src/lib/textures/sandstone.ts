import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { sandstoneRamp } from '@/lib/colors';

const sandstoneGenerator: TextureGenerator = {
  id: 'sandstone',
  name: '사암',
  category: 'nature',
  description: '수평 띠가 있는 층상 사암',
  icon: '🏜️',
  params: [
    ...COMMON_PARAMS,
    { name: 'layerCount', label: '층 수', type: 'range', min: 1, max: 10, default: 4, step: 1 },
    { name: 'layerContrast', label: '층 대비', type: 'range', min: 0.1, max: 2, default: 0.8, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const layerCount = params.layerCount as number;
    const layerContrast = params.layerContrast as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const layerY = ny * layerCount;
        const layerNoise = fbm(nx * 0.5, layerY * layerContrast);
        const detail = fbm(nx * 3, ny * 3) * 0.15;

        const value = (layerNoise + 1) * 0.5 + detail;
        const color = sandstoneRamp(Math.max(0, Math.min(1, value)));

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

export default sandstoneGenerator;
