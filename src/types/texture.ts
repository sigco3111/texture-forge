export type TextureCategory = 'nature' | 'terrain' | 'material' | 'weather' | 'geometric';

export interface TextureParam {
  name: string;
  label: string;
  type: 'range' | 'select' | 'toggle';
  min: number;
  max: number;
  default: number;
  step: number;
}

export interface GenerationParams {
  scale: number;
  octaves: number;
  persistence: number;
  lacunarity: number;
  seed: number;
  resolution: number;
  tiling: boolean;
  [key: string]: number | boolean;
}

export interface TexturePreset {
  id: string;
  name: string;
  category: TextureCategory;
  description: string;
  icon: string;
}

export const TEXTURE_CATEGORIES: { key: TextureCategory; label: string; icon: string }[] = [
  { key: 'nature', label: '자연', icon: '🌿' },
  { key: 'terrain', label: '지형', icon: '🏔️' },
  { key: 'material', label: '재질', icon: '🔩' },
  { key: 'weather', label: '날씨', icon: '☁️' },
  { key: 'geometric', label: '기하학', icon: '📐' },
];

export const DEFAULT_COMMON_PARAMS: Omit<GenerationParams, 'seed' | 'resolution' | 'tiling'> = {
  scale: 50,
  octaves: 4,
  persistence: 0.5,
  lacunarity: 2.0,
};

export const RESOLUTION_OPTIONS = [128, 256, 512, 1024] as const;
