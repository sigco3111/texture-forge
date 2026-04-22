import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { fabricRamp } from '@/lib/colors';

const fabricGenerator: TextureGenerator = {
  id: 'fabric',
  name: '직물',
  category: 'material',
  description: '직교 실 패턴의 직조 직물',
  icon: '🧵',
  params: [
    ...COMMON_PARAMS,
    { name: 'threadCount', label: '실 수', type: 'range', min: 5, max: 50, default: 20, step: 1 },
    { name: 'colorVariation', label: '색상 변화', type: 'range', min: 0, max: 30, default: 10, step: 1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const threadCount = params.threadCount as number;
    const colorVariation = params.colorVariation as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        // Orthogonal noise: separate fBm for x and y directions
        const threadX = fbm(nx * threadCount, ny * 0.5);
        const threadY = fbm(nx * 0.5, ny * threadCount);

        // Weave pattern: alternating over/under based on thread position
        const wx = (nx * threadCount) % 1;
        const wy = (ny * threadCount) % 1;
        const warpThread = Math.abs(threadX) * 0.5 + 0.25;
        const weftThread = Math.abs(threadY) * 0.5 + 0.25;

        const isWarpDominant = (Math.floor(nx * threadCount) + Math.floor(ny * threadCount)) % 2 === 0;
        const baseValue = isWarpDominant ? warpThread : weftThread;

        const variation = fbm(nx * 10, ny * 10) * colorVariation * 0.01;
        const value = Math.max(0, Math.min(1, baseValue + variation));

        const color = fabricRamp(value);

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

export default fabricGenerator;
