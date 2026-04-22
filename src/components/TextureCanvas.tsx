'use client';

import { useRef, useEffect } from 'react';

interface TextureCanvasProps {
  width: number;
  height: number;
  imageData: ImageData | null;
  loading?: boolean;
}

export default function TextureCanvas({ width, height, imageData, loading }: TextureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageData) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.putImageData(imageData, 0, 0);
  }, [imageData]);

  return (
    <div className="relative flex items-center justify-center">
      <div className="checkerboard-bg rounded-lg shadow-xl">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block rounded-lg"
        />
      </div>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#4a9eff] border-t-transparent" />
        </div>
      )}
      {!imageData && !loading && (
        <div className="absolute inset-0 flex items-center justify-center text-[#999999] text-sm">
          프리셋을 선택하세요
        </div>
      )}
    </div>
  );
}