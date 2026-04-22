import { describe, it, expect } from 'vitest';
import { createSeededNoise2D, createSeededNoise3D } from '../simplex';
import { createPerlinNoise2D } from '../perlin';

describe('Simplex Noise', () => {
  it('same seed produces identical output', () => {
    const noise1 = createSeededNoise2D(42);
    const noise2 = createSeededNoise2D(42);
    expect(noise1(0.5, 0.5)).toBe(noise2(0.5, 0.5));
  });

  it('different seeds produce different output', () => {
    const noise1 = createSeededNoise2D(42);
    const noise2 = createSeededNoise2D(99);
    expect(noise1(0.5, 0.5)).not.toBe(noise2(0.5, 0.5));
  });

  it('output is in range [-1, 1]', () => {
    const noise = createSeededNoise2D(42);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const value = noise(x, y);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
  });

  it('output is deterministic across multiple calls', () => {
    const noise = createSeededNoise2D(42);
    const first = noise(0.5, 0.5);
    const second = noise(0.5, 0.5);
    expect(first).toBe(second);
  });

  it('3D noise same seed produces identical output', () => {
    const noise1 = createSeededNoise3D(42);
    const noise2 = createSeededNoise3D(42);
    expect(noise1(0.5, 0.5, 0.5)).toBe(noise2(0.5, 0.5, 0.5));
  });

  it('3D noise output is in range [-1, 1]', () => {
    const noise = createSeededNoise3D(42);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const z = Math.random() * 100;
      const value = noise(x, y, z);
      expect(value).toBeGreaterThanOrEqual(-1);
      expect(value).toBeLessThanOrEqual(1);
    }
  });
});

describe('Perlin Noise', () => {
  it('same seed produces identical output', () => {
    const noise1 = createPerlinNoise2D(42);
    const noise2 = createPerlinNoise2D(42);
    expect(noise1(0.5, 0.5)).toBe(noise2(0.5, 0.5));
  });

  it('different seeds produce different output', () => {
    const noise1 = createPerlinNoise2D(42);
    const noise2 = createPerlinNoise2D(99);
    expect(noise1(0.5, 0.5)).not.toBe(noise2(0.5, 0.5));
  });

  it('output is approximately in range [-1, 1]', () => {
    const noise = createPerlinNoise2D(42);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const value = noise(x, y);
      expect(value).toBeGreaterThanOrEqual(-1.1);
      expect(value).toBeLessThanOrEqual(1.1);
    }
  });

  it('output is deterministic across multiple calls', () => {
    const noise = createPerlinNoise2D(42);
    const first = noise(0.5, 0.5);
    const second = noise(0.5, 0.5);
    expect(first).toBe(second);
  });
});
