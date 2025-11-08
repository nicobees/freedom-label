import type {
  ProgressCallback,
  TextGenerationPipeline,
} from '@huggingface/transformers';

import { pipeline, type PipelineType } from '@huggingface/transformers';

/**
 * tested models (ranked by decreasing performance):
 * - 'Xenova/Phi-3-mini-4k-instruct'
 * - 'onnx-community/Qwen2.5-0.5B-Instruct'
 * - 'onnx-community/gemma-3-270m-it-ONNX'
 * - 'HuggingFaceTB/SmolLM2-360M-Instruct'
 */

export class AutoFillTransformers {
  static readonly model = 'HuggingFaceTB/SmolLM2-360M-Instruct';
  static readonly task: PipelineType = 'text-generation';
  private static instance: null | TextGenerationPipeline = null;

  static async getInstance(
    progress_callback?: ProgressCallback,
  ): Promise<TextGenerationPipeline> {
    if (!this.instance) {
      const options = {
        device: 'webgpu',
        dtype: 'q4', // 'fp16' 'fp32'
        progress_callback,
      } as const;
      this.instance = (await pipeline<PipelineType>(
        this.task,
        this.model,
        options,
      )) as TextGenerationPipeline;
    }

    return this.instance;
  }
}

// await AutoFillTransformers.getInstance((event) => {
//   if (event.status === 'progress') {
//     console.info('inside model loading: ', event.progress);
//     return;
//   }
//   console.info('inside model loading: ', event);
// });
