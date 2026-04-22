export type ColorRamp = (t: number) => [number, number, number];

export function createColorRamp(colors: [number, number, number][]): ColorRamp {
  const lastIdx = colors.length - 1;
  return (t: number): [number, number, number] => {
    const clamped = Math.max(0, Math.min(1, t));
    const scaledT = clamped * lastIdx;
    const idx = Math.min(Math.floor(scaledT), lastIdx - 1);
    const frac = scaledT - idx;
    const c0 = colors[idx];
    const c1 = colors[idx + 1];
    return [
      c0[0] + (c1[0] - c0[0]) * frac,
      c0[1] + (c1[1] - c0[1]) * frac,
      c0[2] + (c1[2] - c0[2]) * frac,
    ];
  };
}

export const marbleColorRamp: ColorRamp = createColorRamp([
  [240, 240, 245], [210, 210, 220], [150, 150, 170],
  [100, 100, 125], [150, 150, 170], [210, 210, 220], [240, 240, 245],
]);

export const woodRamp: ColorRamp = createColorRamp([
  [180, 130, 70], [140, 90, 40], [160, 110, 55], [100, 60, 25],
]);

export const lavaRamp: ColorRamp = createColorRamp([
  [0, 0, 0], [180, 30, 0], [255, 100, 0], [255, 180, 50], [255, 255, 100],
]);

export const fireRamp: ColorRamp = createColorRamp([
  [0, 0, 0], [180, 0, 0], [255, 80, 0], [255, 200, 0], [255, 255, 100], [255, 255, 200],
]);

export const cloudRamp: ColorRamp = createColorRamp([
  [200, 200, 220], [240, 240, 250], [255, 255, 255],
]);

export const terrainRamp: ColorRamp = createColorRamp([
  [30, 80, 30], [80, 140, 40], [140, 120, 60], [160, 140, 120], [220, 220, 230], [255, 255, 255],
]);

export const metalRamp: ColorRamp = createColorRamp([
  [60, 60, 65], [100, 100, 110], [150, 150, 160], [180, 180, 190], [210, 210, 220],
]);

export const rustRamp: ColorRamp = createColorRamp([
  [40, 20, 10], [120, 50, 10], [180, 80, 20], [160, 60, 15], [100, 40, 10],
]);

export const smokeRamp: ColorRamp = createColorRamp([
  [30, 30, 35], [100, 100, 105], [180, 180, 185],
]);

export const fabricRamp: ColorRamp = createColorRamp([
  [60, 60, 120], [80, 80, 140], [50, 50, 100],
]);

export const leatherRamp: ColorRamp = createColorRamp([
  [50, 30, 20], [120, 70, 40], [100, 55, 30], [70, 40, 25],
]);

export const sandstoneRamp: ColorRamp = createColorRamp([
  [180, 160, 120], [200, 180, 140], [170, 150, 110], [190, 170, 130],
]);

export const graniteRamp: ColorRamp = createColorRamp([
  [50, 50, 55], [140, 135, 130], [180, 175, 170], [120, 115, 110], [200, 195, 190],
]);

export const caveRamp: ColorRamp = createColorRamp([
  [15, 12, 10], [60, 50, 40], [100, 85, 70], [140, 125, 105],
]);

export const carpetRamp: ColorRamp = createColorRamp([
  [120, 40, 40], [140, 50, 50], [110, 35, 35],
]);
