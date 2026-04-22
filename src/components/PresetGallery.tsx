'use client';

import { useEffect, useRef, useState } from 'react';
import type { TextureGenerator } from '@/lib/textures/base';
import type { TextureCategory } from '@/types/texture';
import { TEXTURE_CATEGORIES } from '@/types/texture';

interface PresetGalleryProps {
  presets: TextureGenerator[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PresetGallery({ presets, selectedId, onSelect }: PresetGalleryProps) {
  const thumbnailRefs = useRef<Map<string, HTMLCanvasElement>>(new Map());
  const [generated, setGenerated] = useState<Set<string>>(new Set());

  // Generate thumbnails lazily using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-preset-id');
            if (!id) return;
            const preset = presets.find(p => p.id === id);
            if (!preset || generated.has(id)) return;
            
            try {
              const thumb = preset.generateThumbnail();
              const canvas = thumbnailRefs.current.get(id);
              if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx?.putImageData(thumb, 0, 0);
                setGenerated(prev => new Set(prev).add(id));
              }
            } catch { /* ignore generation errors */ }
            
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    thumbnailRefs.current.forEach((canvas) => {
      if (canvas) observer.observe(canvas);
    });

    return () => observer.disconnect();
  }, [presets]);

  const presetsByCategory = TEXTURE_CATEGORIES.map(cat => ({
    ...cat,
    presets: presets.filter(p => p.category === cat.key),
  })).filter(group => group.presets.length > 0);

  return (
    <div className="flex flex-col gap-4">
      {presetsByCategory.map(group => (
        <div key={group.key}>
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">{group.icon}</span>
            <h3 className="text-xs font-semibold text-[#999999] uppercase tracking-wider">{group.label}</h3>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {group.presets.map(preset => (
              <button
                key={preset.id}
                data-preset-id={preset.id}
                onClick={() => onSelect(preset.id)}
                className={`relative rounded-lg overflow-hidden transition-all ${
                  selectedId === preset.id
                    ? 'ring-2 ring-[#4a9eff] shadow-lg shadow-[#4a9eff]/20'
                    : 'hover:ring-1 hover:ring-[#4a9eff]/50'
                }`}
              >
                <canvas
                  ref={(el) => { if (el) thumbnailRefs.current.set(preset.id, el); }}
                  width={64}
                  height={64}
                  data-preset-id={preset.id}
                  className="w-full aspect-square bg-[#1a1a1a]"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1 py-0.5">
                  <span className="text-[10px] text-white truncate block">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}