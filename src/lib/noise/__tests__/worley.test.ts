import { describe, it, expect } from 'vitest';
import { createWorleyNoise } from '../worley';

describe('Worley Noise', () => {
  it('same seed produces identical output', () => {
    const noise1 = createWorleyNoise(42);
    const noise2 = createWorleyNoise(42);
    const result1 = noise1(0.5, 0.5);
    const result2 = noise2(0.5, 0.5);
    expect(result1.f1).toBe(result2.f1);
    expect(result1.f2).toBe(result2.f2);
  });

  it('different seeds produce different output', () => {
    const noise1 = createWorleyNoise(42);
    const noise2 = createWorleyNoise(99);
    const result1 = noise1(0.5, 0.5);
    const result2 = noise2(0.5, 0.5);
    expect(result1.f1).not.toBe(result2.f1);
  });

  it('f1 is always less than or equal to f2', () => {
    const noise = createWorleyNoise(42);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const { f1, f2 } = noise(x, y);
      expect(f1).toBeLessThanOrEqual(f2);
    }
  });

  it('output values are non-negative', () => {
    const noise = createWorleyNoise(42);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const { f1, f2 } = noise(x, y);
      expect(f1).toBeGreaterThanOrEqual(0);
      expect(f2).toBeGreaterThanOrEqual(0);
    }
  });

  it('output is deterministic across multiple calls', () => {
    const noise = createWorleyNoise(42);
    const first = noise(0.5, 0.5);
    const second = noise(0.5, 0.5);
    expect(first.f1).toBe(second.f1);
    expect(first.f2).toBe(second.f2);
  });

  it('f1 at a feature point is approximately 0', () => {
    const noise = createWorleyNoise(42);
    let minF1 = Infinity;
    for (let x = 0; x < 1; x += 0.01) {
      for (let y = 0; y < 1; y += 0.01) {
        const { f1 } = noise(x, y);
        if (f1 < minF1) minF1 = f1;
      }
    }
    expect(minF1).toBeLessThan(0.05);
  });
});
