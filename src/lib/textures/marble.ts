import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createTurbulence } from '@/lib/noise/turbulence';
import { marbleColorRamp } from '@/lib/colors';

const marbleGenerator: TextureGenerator = {
  id: 'marble',
  name: '대리석',
  category: 'nature',
  description: '흰색/회색 대리석 결',
  icon: '🏛️',
  params: [
    ...COMMON_PARAMS,
    { name: 'frequency', label: '주파수', type: 'range', min: 1, max: 20, default: 5, step: 0.5 },
    { name: 'distortion', label: '왜곡', type: 'range', min: 0.1, max: 10, default: 3, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const turbulence = createTurbulence(
      noise,
      params.octaves,
      params.persistence,
      params.lacunarity,
    );

    const scale = params.scale;
    const frequency = params.frequency as number;
    const distortion = params.distortion as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const turb = turbulence(nx, ny);
        const value = Math.sin(nx * frequency + turb * distortion);
        const normalized = (value + 1) * 0.5;
        const color = marbleColorRamp(normalized);

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

export default marbleGenerator;
