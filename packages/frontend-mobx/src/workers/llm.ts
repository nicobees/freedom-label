import type {
  ProgressCallback,
  TextGenerationPipeline,
} from '@huggingface/transformers';

import {
  pipeline,
  type PipelineType,
  TextStreamer,
} from '@huggingface/transformers';

import {
  prompts,
  systemPrompt,
} from '../services/auto-fill-form/chromeBuiltIn/constants';

class AutoFillAgent {
  static readonly model = 'onnx-community/gemma-3-270m-it-ONNX';
  // 'Xenova/gemma-2-2b-it-ONNX';
  // 'onnx-community/gemma-2-2b-it'
  // 'HuggingFaceTB/SmolLM2-360M-Instruct';
  static readonly task: PipelineType = 'text-generation';
  private static instance: null | TextGenerationPipeline = null;

  static async getInstance(
    progress_callback?: ProgressCallback,
  ): Promise<TextGenerationPipeline> {
    if (!this.instance) {
      const options = {
        device: 'webgpu',
        dtype: 'fp32',
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

const SYSTEM_PROMPT = `You are a contact lens specification extractor. Extract data from text and output valid JSON only.

Output format (JSON only, no text):
{
  "patientName": "string or null",
  "patientSurname": "string or null",
  "leftLens": {"pwr": -2.25, "sag": 1234, "sag_toric": null, "batch": "10-2025"},
  "rightLens": null,
  "due_date": "DD/MM/YYYY or null"
}

Rules:
- Power deficits are negative numbers
- Use null for missing fields
- Output ONLY valid JSON, no explanation`;

self.onmessage = async function (event: MessageEvent<string>) {
  try {
    const data = event.data;

    console.info('inside worker onmessage: ', data);

    const agent = await AutoFillAgent.getInstance((x) => {
      // We also add a progress callback to the pipeline so that we can
      // track model loading.
      // console.log('Model loading progress:', x);
      self.postMessage(x);
    });

    const prompt = `<|im_start|>system
${systemPrompt}<|im_end|>
<|im_start|>user
${data}<|im_end|>
<|im_start|>assistant`;

    const newPrompt = [
      { content: systemPrompt, role: 'system' },
      { content: prompts[4], role: 'user' },
    ];
    const result = await agent(
      newPrompt,
      {
        do_sample: false,
        // max_new_tokens: 1000,
        max_new_tokens: 512,
        return_full_text: false,
        temperature: 0.2,
        top_k: 3,
      },
      //   {
      //   do_sample: false,
      //   max_new_tokens: 42,
      //   // streamer,
      //   temperature: 0.1,
      //   top_k: 3,
      // }
    );

    console.info('result: ', result);

    // const processedData = processData(data);
    postMessage(result);
  } catch (error) {
    console.error('Worker encountered an error:', error);
    postMessage({ error: error.message });
  }
};

// function processData(data) {
//   // Perform heavy data processing here
//   return data.map((item) => item * 2); // Example transformation
// }

// self.addEventListener('message', async (event) => {
//   // Retrieve the translation pipeline. When called for the first time,
//   // this will load the pipeline and save it for future use.
//   const translator = await MyTranslationPipeline.getInstance((x) => {
//     // We also add a progress callback to the pipeline so that we can
//     // track model loading.
//     self.postMessage(x);
//   });

//   // Capture partial output as it streams from the pipeline
//   const streamer = new TextStreamer(translator.tokenizer, {
//     callback_function: function (text) {
//       self.postMessage({
//         output: text,
//         status: 'update',
//       });
//     },
//     skip_prompt: true,
//     skip_special_tokens: true,
//   });

//   // Actually perform the translation
//   const output = await translator(event.data.text, {
//     src_lang: event.data.src_lang,
//     // Allows for partial output to be captured
//     streamer,

//     tgt_lang: event.data.tgt_lang,
//   });

//   // Send the output back to the main thread
//   self.postMessage({
//     output,
//     status: 'complete',
//   });
// });
