import type { TextureCategory, TextureParam, GenerationParams } from '@/types/texture';

export interface TextureGenerator {
  readonly id: string;
  readonly name: string;
  readonly category: TextureCategory;
  readonly description: string;
  readonly icon: string;
  readonly params: TextureParam[];

  generate(width: number, height: number, params: GenerationParams): ImageData;
  generateThumbnail(): ImageData;
}

export const COMMON_PARAMS: TextureParam[] = [
  { name: 'scale', label: '크기', type: 'range', min: 1, max: 200, default: 50, step: 1 },
  { name: 'octaves', label: '옥타브', type: 'range', min: 1, max: 8, default: 4, step: 1 },
  { name: 'persistence', label: '지속성', type: 'range', min: 0.1, max: 0.9, default: 0.5, step: 0.05 },
  { name: 'lacunarity', label: '래큐나리티', type: 'range', min: 1.0, max: 4.0, default: 2.0, step: 0.1 },
];

export function createDefaultParams(params: TextureParam[]): Record<string, number | boolean> {
  const result: Record<string, number | boolean> = {
    seed: Math.floor(Math.random() * 10000),
    resolution: 256,
    tiling: false,
  };
  for (const p of params) {
    result[p.name] = p.default;
  }
  return result;
}

export function createPixelBuffer(width: number, height: number): Uint8ClampedArray {
  return new Uint8ClampedArray(width * height * 4);
}

export function setPixel(
  buffer: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
  r: number,
  g: number,
  b: number,
  a: number = 255
): void {
  const idx = (y * width + x) * 4;
  buffer[idx] = r;
  buffer[idx + 1] = g;
  buffer[idx + 2] = b;
  buffer[idx + 3] = a;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}
