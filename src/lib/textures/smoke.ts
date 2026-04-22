import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { smokeRamp } from '@/lib/colors';

const smokeGenerator: TextureGenerator = {
  id: 'smoke',
  name: '연기',
  category: 'weather',
  description: '방사형 페이드가 있는 소산 연기',
  icon: '💨',
  params: [
    ...COMMON_PARAMS,
    { name: 'density', label: '밀도', type: 'range', min: 0, max: 1, default: 0.6, step: 0.05 },
    { name: 'dispersion', label: '확산', type: 'range', min: 0.5, max: 3, default: 1.5, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const density = params.density as number;
    const dispersion = params.dispersion as number;

    const cx = width * 0.5;
    const cy = height * 0.5;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const value = fbm(nx * dispersion, ny * dispersion);

        // Radial fade from center
        const dx = x - cx;
        const dy = y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
        const radialFade = Math.max(0, 1 - dist * 1.4);

        const alpha = Math.floor(Math.max(0, Math.min(1, value * density)) * radialFade * 255);
        const colorValue = Math.max(0, Math.min(1, value * 0.5 + 0.25));
        const color = smokeRamp(colorValue);

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

export default smokeGenerator;
