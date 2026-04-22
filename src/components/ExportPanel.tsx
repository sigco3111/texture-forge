'use client';

import { useState, useCallback } from 'react';
import type { TextureGenerator } from '@/lib/textures/base';
import type { GenerationParams } from '@/types/texture';
import { RESOLUTION_OPTIONS } from '@/types/texture';

interface ExportPanelProps {
  generator: TextureGenerator | null;
  params: Record<string, number | boolean>;
}

export default function ExportPanel({ generator, params }: ExportPanelProps) {
  const [resolution, setResolution] = useState<number>(256);
  const [exporting, setExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!generator) return;
    
    setExporting(true);
    
    try {
      // Generate texture at selected resolution (sync, may block for high-res)
      const imageData = generator.generate(resolution, resolution, params as GenerationParams);
      
      // Create offscreen canvas to convert ImageData to PNG blob
      const canvas = document.createElement('canvas');
      canvas.width = resolution;
      canvas.height = resolution;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not available');
      ctx.putImageData(imageData, 0, 0);
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generator.id}_${resolution}x${resolution}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setExporting(false);
      }, 'image/png');
    } catch (err) {
      console.error('Export failed:', err);
      setExporting(false);
    }
  }, [generator, params, resolution]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
      <h3 className="text-sm font-semibold text-[#999999] uppercase tracking-wider">내보내기</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs text-[#e0e0e0]">해상도</label>
        <div className="flex gap-1">
          {RESOLUTION_OPTIONS.map(res => (
            <button
              key={res}
              onClick={() => setResolution(res)}
              className={`flex-1 px-2 py-1.5 text-xs rounded transition-colors ${
                resolution === res
                  ? 'bg-[#4a9eff] text-white'
                  : 'bg-[#222222] text-[#999999] hover:bg-[#333333]'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!generator || exporting}
        className="w-full py-2 px-4 bg-[#4a9eff] text-white text-sm font-medium rounded-lg 
          hover:bg-[#6ab4ff] disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          flex items-center justify-center gap-2"
      >
        {exporting ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            생성 중...
          </>
        ) : (
          '⬇ PNG 다운로드'
        )}
      </button>
    </div>
  );
}