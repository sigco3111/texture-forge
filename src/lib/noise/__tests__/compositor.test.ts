import { describe, it, expect } from 'vitest';
import { createSeededNoise2D } from '../simplex';
import { createFBM } from '../fbm';
import { createTurbulence } from '../turbulence';

const SEED = 42;
const TOLERANCE = 0.01;

describe('fBm', () => {
  it('with fixed seed + octaves produces deterministic output', () => {
    const noise = createSeededNoise2D(SEED);
    const fbm = createFBM(noise, 4, 0.5, 2.0);
    const a = fbm(0.5, 0.5);
    const b = fbm(0.5, 0.5);
    expect(a).toBe(b);
  });

  it('output is in range [-1, 1]', () => {
    const noise = createSeededNoise2D(SEED);
    const fbm = createFBM(noise, 6, 0.5, 2.0);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const value = fbm(x, y);
      expect(value).toBeGreaterThanOrEqual(-1 - TOLERANCE);
      expect(value).toBeLessThanOrEqual(1 + TOLERANCE);
    }
  });

  it('more octaves = more detail (different output with octaves=1 vs octaves=6)', () => {
    const noise = createSeededNoise2D(SEED);
    const fbm1 = createFBM(noise, 1, 0.5, 2.0);
    const fbm6 = createFBM(noise, 6, 0.5, 2.0);
    const value1 = fbm1(1.23, 4.56);
    const value6 = fbm6(1.23, 4.56);
    expect(value1).not.toBe(value6);
  });

  it('persistence=0 means only first octave contributes', () => {
    const noise = createSeededNoise2D(SEED);
    const fbm = createFBM(noise, 4, 0, 2.0);
    // With persistence=0, only the first octave contributes.
    // The result should equal the raw noise at the base frequency.
    const expected = noise(1.0, 2.0);
    const actual = fbm(1.0, 2.0);
    expect(actual).toBeCloseTo(expected, 10);
  });
});

describe('Turbulence', () => {
  it('all output values >= 0', () => {
    const noise = createSeededNoise2D(SEED);
    const turb = createTurbulence(noise, 6, 0.5, 2.0);
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const value = turb(x, y);
      expect(value).toBeGreaterThanOrEqual(0);
    }
  });

  it('deterministic output', () => {
    const noise = createSeededNoise2D(SEED);
    const turb = createTurbulence(noise, 4, 0.5, 2.0);
    const a = turb(0.5, 0.5);
    const b = turb(0.5, 0.5);
    expect(a).toBe(b);
  });

  it('persistence=0 means only first octave contributes', () => {
    const noise = createSeededNoise2D(SEED);
    const turb = createTurbulence(noise, 4, 0, 2.0);
    const expected = Math.abs(noise(1.0, 2.0));
    const actual = turb(1.0, 2.0);
    expect(actual).toBeCloseTo(expected, 10);
  });
});
