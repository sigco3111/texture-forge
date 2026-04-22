import { describe, it, expect } from 'vitest';
import { createDomainWarp } from '../domain-warp';
import { createSeededNoise2D } from '../simplex';

describe('createDomainWarp', () => {
  it('returns original coordinates when strength is 0', () => {
    const noise = createSeededNoise2D(42);
    const warp = createDomainWarp(noise, 0);
    const [wx, wy] = warp(0.5, 0.5);
    expect(wx).toBe(0.5);
    expect(wy).toBe(0.5);
  });

  it('changes coordinates when strength > 0', () => {
    const noise = createSeededNoise2D(42);
    const warp = createDomainWarp(noise, 1.5);
    const [wx, wy] = warp(0.5, 0.5);
    expect(wx).not.toBe(0.5);
    expect(wy).not.toBe(0.5);
  });

  it('is deterministic with same noise and strength', () => {
    const noise = createSeededNoise2D(42);
    const warp1 = createDomainWarp(noise, 2.0);
    const warp2 = createDomainWarp(noise, 2.0);
    expect(warp1(0.5, 0.5)).toEqual(warp2(0.5, 0.5));
  });

  it('returns a tuple of two numbers', () => {
    const noise = createSeededNoise2D(42);
    const warp = createDomainWarp(noise, 1.0);
    const result = warp(0.5, 0.5);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
    expect(typeof result[0]).toBe('number');
    expect(typeof result[1]).toBe('number');
  });
});
