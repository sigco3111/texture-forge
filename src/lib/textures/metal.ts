import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';
import { createSeededNoise2D } from '@/lib/noise/simplex';
import { createFBM } from '@/lib/noise/fbm';
import { metalRamp } from '@/lib/colors';

const metalGenerator: TextureGenerator = {
  id: 'metal',
  name: '금속',
  category: 'material',
  description: '방향성 브러시 처리와 반사 하이라이트가 있는 금속',
  icon: '🔩',
  params: [
    ...COMMON_PARAMS,
    { name: 'scratchDensity', label: '스크래치 밀도', type: 'range', min: 1, max: 20, default: 8, step: 1 },
    { name: 'brushAngle', label: '브러시 각도', type: 'range', min: 0, max: 3.14, default: 0.5, step: 0.1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const noise = createSeededNoise2D(params.seed);
    const fbm = createFBM(noise, params.octaves, params.persistence, params.lacunarity);

    const scale = params.scale;
    const scratchDensity = params.scratchDensity as number;
    const brushAngle = params.brushAngle as number;

    const cosA = Math.cos(brushAngle);
    const sinA = Math.sin(brushAngle);

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      const ny = y / height * scale * 0.01;
      for (let x = 0; x < width; x++) {
        const nx = x / width * scale * 0.01;

        // Rotate coordinates along brush direction
        const rx = nx * cosA - ny * sinA;
        const ry = nx * sinA + ny * cosA;

        // Directional fBm — sample heavily along brush axis
        const brushNoise = fbm(rx * scratchDensity, ry * scratchDensity * 0.1);

        // Specular highlight: noise near max → bright
        const specular = brushNoise > 0.7 ? (brushNoise - 0.7) / 0.3 : 0;

        const value = Math.max(0, Math.min(1, brushNoise * 0.7 + specular * 0.3));
        const color = metalRamp(value);

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

export default metalGenerator;
