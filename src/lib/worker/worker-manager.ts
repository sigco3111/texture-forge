import type { GenerationParams } from '@/types/texture';
import type { RenderResponse, RenderError } from '@/types/worker';

export class TextureWorkerManager {
  private worker: Worker | null = null;
  private jobId = 0;
  private latestJobId = 0;
  private pendingResolve: ((value: ImageData) => void) | null = null;
  private pendingReject: ((reason: Error) => void) | null = null;

  constructor() {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./texture.worker.ts', import.meta.url),
        { type: 'module' },
      );
      this.worker.onmessage = this.handleMessage.bind(this);
      this.worker.onerror = this.handleError.bind(this);
    }
  }

  render(
    presetId: string,
    params: GenerationParams,
    width: number,
    height: number,
  ): Promise<ImageData> {
    return new Promise((resolve, reject) => {
      if (!this.worker) {
        reject(new Error('Web Workers not supported'));
        return;
      }

      if (this.pendingReject) {
        this.pendingReject(new Error('Cancelled'));
      }

      const id = ++this.jobId;
      this.latestJobId = id;
      this.pendingResolve = resolve;
      this.pendingReject = reject;

      this.worker.postMessage({
        type: 'render',
        id,
        presetId,
        params,
        width,
        height,
      });
    });
  }

  private handleMessage(event: MessageEvent<RenderResponse | RenderError>): void {
    const { type, id } = event.data;

    if (id !== this.latestJobId) return;

    if (type === 'result') {
      const { imageData, width, height } = event.data as RenderResponse;
      const data = new Uint8ClampedArray(imageData);
      this.pendingResolve?.(new ImageData(data, width, height));
      this.pendingResolve = null;
      this.pendingReject = null;
    } else if (type === 'error') {
      const { message } = event.data as RenderError;
      this.pendingReject?.(new Error(message));
      this.pendingResolve = null;
      this.pendingReject = null;
    }
  }

  private handleError(error: ErrorEvent): void {
    this.pendingReject?.(new Error(error.message));
    this.pendingResolve = null;
    this.pendingReject = null;
  }

  destroy(): void {
    this.worker?.terminate();
    this.worker = null;
  }
}
