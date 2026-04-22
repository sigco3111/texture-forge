import type { GenerationParams } from './texture';

export interface RenderRequest {
  type: 'render';
  id: number;
  presetId: string;
  params: GenerationParams;
  width: number;
  height: number;
}

export interface RenderResponse {
  type: 'result';
  id: number;
  imageData: ArrayBuffer;
  width: number;
  height: number;
}

export interface RenderError {
  type: 'error';
  id: number;
  message: string;
}

export type WorkerMessage = RenderRequest;
export type WorkerResponse = RenderResponse | RenderError;
