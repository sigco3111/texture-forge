import { describe, it, expect } from 'vitest';
import marbleGenerator from '../marble';

// Polyfill ImageData for Node test environment
if (typeof globalThis.ImageData === 'undefined') {
  class NodeImageData {
    readonly data: Uint8ClampedArray;
    readonly width: number;
    readonly height: number;
    constructor(data: Uint8ClampedArray, sw: number, sh?: number) {
      this.data = data;
      this.width = sw;
      this.height = sh ?? data.length / (4 * sw);
    }
  }
  Object.defineProperty(globalThis, 'ImageData', { value: NodeImageData, writable: true });
}

const defaultParams = {
  seed: 42,
  resolution: 256,
  tiling: false,
  scale: 50,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
  frequency: 5,
  distortion: 3,
};

describe('Marble Texture Generator', () => {
  it('returns correct ImageData dimensions for 256x256', () => {
    const result = marbleGenerator.generate(256, 256, defaultParams);
    expect(result.width).toBe(256);
    expect(result.height).toBe(256);
    expect(result.data.length).toBe(256 * 256 * 4);
  });

  it('all RGBA values are in [0, 255] range', () => {
    const result = marbleGenerator.generate(256, 256, defaultParams);
    for (let i = 0; i < result.data.length; i++) {
      expect(result.data[i]).toBeGreaterThanOrEqual(0);
      expect(result.data[i]).toBeLessThanOrEqual(255);
    }
  });

  it('is deterministic: same params produce same output', () => {
    const result1 = marbleGenerator.generate(256, 256, defaultParams);
    const result2 = marbleGenerator.generate(256, 256, defaultParams);
    expect(result1.data).toEqual(result2.data);
  });

  it('generates 256x256 in under 100ms', () => {
    const start = performance.now();
    marbleGenerator.generate(256, 256, defaultParams);
    const elapsed = performance.now() - start;
    expect(elapsed).toBeLessThan(100);
  });

  it('generateThumbnail returns 64x64 ImageData', () => {
    const result = marbleGenerator.generateThumbnail();
    expect(result.width).toBe(64);
    expect(result.height).toBe(64);
    expect(result.data.length).toBe(64 * 64 * 4);
  });
});
