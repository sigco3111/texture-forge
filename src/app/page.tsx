'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import TextureCanvas from '@/components/TextureCanvas';
import ParamPanel from '@/components/ParamPanel';
import PresetGallery from '@/components/PresetGallery';
import ExportPanel from '@/components/ExportPanel';
import { type TextureGenerator, createDefaultParams } from '@/lib/textures/base';
import { getAllPresets } from '@/lib/textures/registry';
import type { GenerationParams } from '@/types/texture';

const presets = getAllPresets();

export default function Home() {
  const [selectedId, setSelectedId] = useState<string>(presets[0].id);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<Record<string, number | boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const selected = presets.find(p => p.id === selectedId) ?? null;
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    if (!selected) return;
    const defaults = createDefaultParams(selected.params);
    setParams(defaults);
    generatePreview(selected, defaults as GenerationParams);
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  function generatePreview(gen: TextureGenerator, p: GenerationParams) {
    setLoading(true);
    try {
      const result = gen.generate(256, 256, p);
      setImageData(result);
    } catch (e) {
      console.error('Generation failed:', e);
    }
    setLoading(false);
  }

  const handleParamChange = useCallback((key: string, value: number | boolean) => {
    setParams(prev => {
      const next = { ...prev, [key]: value };
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        const gen = selectedRef.current;
        if (gen) generatePreview(gen, next as GenerationParams);
      }, 50);
      return next;
    });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#111111] text-[#e0e0e0]">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 flex-shrink-0 border-r border-[#333333] overflow-y-auto p-3">
          <PresetGallery presets={presets} selectedId={selectedId} onSelect={setSelectedId} />
        </aside>

        <main className="flex-1 flex items-center justify-center p-6 overflow-auto">
          <TextureCanvas width={256} height={256} imageData={imageData} loading={loading} />
        </main>

        <aside className="w-72 flex-shrink-0 border-l border-[#333333] overflow-y-auto p-3 flex flex-col gap-4">
          {selected ? (
            <>
              <ParamPanel params={selected.params} values={params} onChange={handleParamChange} />
              <ExportPanel generator={selected} params={params} />
            </>
          ) : (
            <div className="text-sm text-[#666666]">선택된 프리셋이 없습니다</div>
          )}
        </aside>
      </div>
    </div>
  );
}
