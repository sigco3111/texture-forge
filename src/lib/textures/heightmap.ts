import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { terrainRamp } from '@/lib/colors';

const heightmapGenerator: TextureGenerator = {
  id: 'heightmap',
  name: '높이맵',
  category: 'terrain',
  description: '고도 기반 색상의 지형 높이맵',
  icon: '🏔️',
  params: [
    ...COMMON_PARAMS,
    { name: 'seaLevel', label: '해수면', type: 'range', min: 0, max: 0.5, default: 0.3, step: 0.05 },
    { name: 'mountainHeight', label: '산 높이', type: 'range', min: 0.5, max: 2, default: 1, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const seaLevel = params.seaLevel as number;
    const mountainHeight = params.mountainHeight as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        const heightVal = fbm(nx, ny);
        const normalized = (heightVal + 1) * 0.5;
        const scaled = normalized * mountainHeight;

        let colorVal: number;
        if (scaled < seaLevel) {
          colorVal = scaled / seaLevel * 0.3;
        } else {
          colorVal = 0.3 + ((scaled - seaLevel) / (1 - seaLevel)) * 0.7;
        }

        const color = terrainRamp(Math.max(0, Math.min(1, colorVal)));

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

export default heightmapGenerator;
