import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { createDomainWarp } from '@/lib/noise/domain-warp';
import { fireRamp } from '@/lib/colors';

const fireGenerator: TextureGenerator = {
  id: 'fire',
  name: '불',
  category: 'weather',
  description: '수직 그라디언트가 있는 깜빡이는 화염',
  icon: '🔥',
  params: [
    ...COMMON_PARAMS,
    { name: 'flameHeight', label: '화염 높이', type: 'range', min: 0.3, max: 1, default: 0.7, step: 0.05 },
    { name: 'turbulence', label: '난류', type: 'range', min: 0.5, max: 5, default: 2, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const warp = createDomainWarp(noise, params.turbulence as number);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const flameHeight = params.flameHeight as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const [wx, wy] = warp(nx * 2, ny * 2);
        const value = fbm(wx, wy);

        // Vertical gradient: bright at bottom (ny≈0), dark at top
        const verticalFade = 1 - (y / height);
        const weighted = value * verticalFade * flameHeight;

        const colorValue = Math.max(0, Math.min(1, weighted));
        const color = fireRamp(colorValue);

        const alpha = colorValue > 0.05 ? Math.min(255, Math.floor(colorValue * 255 * 1.5)) : 0;

        const idx = (y * width + x) * 4;
        buffer[idx] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
        buffer[idx + 3] = alpha;
      }
    }

    return new ImageData(new Uint8ClampedArray(buffer), width, height);
  },

  generateThumbnail(): ImageData {
    const defaults = createDefaultParams(this.params) as GenerationParams;
    return this.generate(64, 64, { ...defaults, seed: 42 });
  },
};

export default fireGenerator;
