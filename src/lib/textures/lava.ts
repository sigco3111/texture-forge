import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createTurbulence } from '@/lib/noise/turbulence';
import { createDomainWarp } from '@/lib/noise/domain-warp';
import { lavaRamp } from '@/lib/colors';

const lavaGenerator: TextureGenerator = {
  id: 'lava',
  name: '용암',
  category: 'terrain',
  description: '열 왜곡이 있는 흐르는 용암',
  icon: '🌋',
  params: [
    ...COMMON_PARAMS,
    { name: 'flowStrength', label: '유동 강도', type: 'range', min: 0.1, max: 5, default: 2, step: 0.1 },
    { name: 'heat', label: '열기', type: 'range', min: 0.5, max: 3, default: 1.5, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const warp = createDomainWarp(noise, params.flowStrength as number);
    const turbulence = createTurbulence(
      noise,
      params.octaves,
      params.persistence,
      params.lacunarity,
    );

    const scale = params.scale;
    const flowStrength = params.flowStrength as number;
    const heat = params.heat as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const [wx, wy] = warp(nx * flowStrength, ny * flowStrength);
        const turb = turbulence(wx, wy);

        const value = Math.pow(turb, 1 / heat);

        const color = lavaRamp(Math.max(0, Math.min(1, value)));

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

export default lavaGenerator;
