import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createDomainWarp } from '@/lib/noise/domain-warp';
import { woodRamp } from '@/lib/colors';

const woodGenerator: TextureGenerator = {
  id: 'wood',
  name: '나무',
  category: 'nature',
  description: '원통형 나무 결 링과 왜곡',
  icon: '\u{1FAB5}',
  params: [
    ...COMMON_PARAMS,
    { name: 'ringScale', label: '결 간격', type: 'range', min: 1, max: 20, default: 10, step: 1 },
    { name: 'grainDistortion', label: '결 왜곡', type: 'range', min: 0, max: 5, default: 2, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const warp = createDomainWarp(noise, params.grainDistortion as number);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const ringScale = params.ringScale as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const [wx, wy] = warp(nx, ny);

        const r = Math.sqrt(wx * wx + wy * wy);
        const theta = Math.atan2(wy, wx);

        const ringValue = fbm(r * ringScale, theta);
        const color = woodRamp(ringValue);

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

export default woodGenerator;
