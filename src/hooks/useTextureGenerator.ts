'use client';

import { useState, useCallback, useRef } from 'react';
import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { createDefaultParams } from '@/lib/textures/base';

export function useTextureGenerator(generator: TextureGenerator | null) {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<Record<string, number | boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const generatorRef = useRef(generator);
  generatorRef.current = generator;

  const generatePreview = useCallback((gen: TextureGenerator, p: GenerationParams) => {
    setLoading(true);
    requestAnimationFrame(() => {
      try {
        const result = gen.generate(256, 256, p);
        setImageData(result);
      } catch (e) {
        console.error('Generation failed:', e);
      }
      setLoading(false);
    });
  }, []);

  const initParams = useCallback(() => {
    if (!generator) {
      setParams({});
      setImageData(null);
      return;
    }
    const defaults = createDefaultParams(generator.params);
    setParams(defaults);
    generatePreview(generator, defaults as GenerationParams);
  }, [generator, generatePreview]);

  const updateParam = useCallback((key: string, value: number | boolean) => {
    setParams(prev => {
      const next = { ...prev, [key]: value };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const gen = generatorRef.current;
        if (gen) generatePreview(gen, next as GenerationParams);
      }, 50);
      return next;
    });
  }, [generatePreview]);

  return { imageData, loading, params, initParams, updateParam };
}
