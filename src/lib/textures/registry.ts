import type { TextureGenerator } from './base';
import type { TextureCategory } from '@/types/texture';

import marbleGenerator from './marble';
import woodGenerator from './wood';
import graniteGenerator from './granite';
import sandstoneGenerator from './sandstone';
import heightmapGenerator from './heightmap';
import caveGenerator from './cave';
import lavaGenerator from './lava';
import metalGenerator from './metal';
import rustGenerator from './rust';
import fabricGenerator from './fabric';
import leatherGenerator from './leather';
import cloudGenerator from './cloud';
import smokeGenerator from './smoke';
import fireGenerator from './fire';
import checkerboardGenerator from './checkerboard';
import brickGenerator from './brick';
import tileGenerator from './tile';
import carpetGenerator from './carpet';

const allPresets: TextureGenerator[] = [
  marbleGenerator, woodGenerator, graniteGenerator, sandstoneGenerator,
  heightmapGenerator, caveGenerator, lavaGenerator,
  metalGenerator, rustGenerator, fabricGenerator, leatherGenerator,
  cloudGenerator, smokeGenerator, fireGenerator,
  checkerboardGenerator, brickGenerator, tileGenerator, carpetGenerator,
];

export function getAllPresets(): TextureGenerator[] {
  return allPresets;
}

export function getPresetById(id: string): TextureGenerator | undefined {
  return allPresets.find(p => p.id === id);
}

export function getPresetsByCategory(category: TextureCategory): TextureGenerator[] {
  return allPresets.filter(p => p.category === category);
}
