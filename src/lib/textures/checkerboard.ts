import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { COMMON_PARAMS, createDefaultParams, createPixelBuffer } from '@/lib/textures/base';

const LIGHT: [number, number, number] = [200, 200, 200];
const DARK: [number, number, number] = [50, 50, 50];

const checkerboardGenerator: TextureGenerator = {
  id: 'checkerboard',
  name: '체스판',
  category: 'geometric',
  description: '밝은색과 어두운색이 교차하는 사각형',
  icon: '▦',
  params: [
    ...COMMON_PARAMS,
    { name: 'checkSize', label: '칸 크기', type: 'range', min: 2, max: 50, default: 16, step: 1 },
  ],

  generate(width: number, height: number, params): ImageData {
    const checkSize = params.checkSize as number;

    const buffer = createPixelBuffer(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const checkX = Math.floor(x / checkSize);
        const checkY = Math.floor(y / checkSize);
        const isLight = (checkX + checkY) % 2 === 0;

        const color = isLight ? LIGHT : DARK;

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

export default checkerboardGenerator;
