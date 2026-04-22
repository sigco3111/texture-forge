/* eslint-disable no-restricted-globals */
import type { TextureGenerator } from '@/lib/textures/base';
import type { RenderRequest, RenderResponse, RenderError } from '@/types/worker';

type WorkerContext = {
  onmessage: ((ev: MessageEvent<RenderRequest>) => void) | null;
  postMessage(message: unknown, transfer: Transferable[]): void;
  postMessage(message: unknown): void;
};

const ctx = self as unknown as WorkerContext;

// Static registry — generators register themselves via registerGenerator()
const registry = new Map<string, TextureGenerator>();

export function registerGenerator(gen: TextureGenerator): void {
  registry.set(gen.id, gen);
}

ctx.onmessage = async (event: MessageEvent<RenderRequest>) => {
  const { type, id, presetId, params, width, height } = event.data;
  if (type !== 'render') return;

  try {
    const generator = registry.get(presetId);
    if (!generator) {
      const error: RenderError = {
        type: 'error',
        id,
        message: `Unknown preset: ${presetId}`,
      };
      ctx.postMessage(error);
      return;
    }

    const imageData = generator.generate(width, height, params);
    // Clone the buffer before transferring — ImageData ownership stays with the worker
    const buffer = imageData.data.buffer.slice(0);

    const response: RenderResponse = {
      type: 'result',
      id,
      imageData: buffer,
      width,
      height,
    };
    ctx.postMessage(response, [buffer]);
  } catch (err) {
    const error: RenderError = {
      type: 'error',
      id,
      message: err instanceof Error ? err.message : 'Unknown error',
    };
    ctx.postMessage(error);
  }
};

export {};
