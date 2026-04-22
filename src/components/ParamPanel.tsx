'use client';

import { useCallback, useRef } from 'react';
import type { TextureParam } from '@/types/texture';

interface ParamPanelProps {
  params: TextureParam[];
  values: Record<string, number | boolean>;
  onChange: (key: string, value: number | boolean) => void;
}

export default function ParamPanel({ params, values, onChange }: ParamPanelProps) {
  // Use ref for debounce timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback((name: string, value: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(name, value);
    }, 100);
  }, [onChange]);

  return (
    <div className="flex flex-col gap-3 p-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
      <h3 className="text-sm font-semibold text-[#999999] uppercase tracking-wider mb-1">파라미터</h3>
      {params.map((param) => {
        const val = values[param.name] ?? param.default;
        return (
          <div key={param.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-xs text-[#e0e0e0]">{param.label}</label>
              <input
                type="number"
                value={typeof val === 'number' ? val : param.default}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!isNaN(v)) handleChange(param.name, Math.max(param.min, Math.min(param.max, v)));
                }}
                step={param.step}
                min={param.min}
                max={param.max}
                className="w-16 text-right text-xs bg-[#222222] border border-[#333333] rounded px-1.5 py-0.5 text-[#e0e0e0] focus:outline-none focus:border-[#4a9eff]"
              />
            </div>
            {param.type === 'range' && (
              <input
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={typeof val === 'number' ? val : param.default}
                onChange={(e) => handleChange(param.name, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#333333] rounded-full appearance-none cursor-pointer accent-[#4a9eff]"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}