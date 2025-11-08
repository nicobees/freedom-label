import {
  initialPrompts,
  prompts,
  systemPrompt,
} from '../services/auto-fill-form/constants';
import { AutoFillTransformers } from '../services/auto-fill-form/transformersjs';

await AutoFillTransformers.getInstance((event) => {
  if (event.status === 'progress') {
    console.info('inside model loading: ', event.progress);
    return;
  }
  console.info('inside model loading: ', event);
});

self.onmessage = async function (event: MessageEvent<string>) {
  try {
    const data = event.data;

    const agent = await AutoFillTransformers.getInstance();

    const newPrompt = [
      { content: systemPrompt, role: 'system' },
      ...initialPrompts.slice(0, 2),
      { content: data || prompts[4], role: 'user' },
    ];
    const initTime = performance.now();
    const result = await agent(
      newPrompt,
      {
        do_sample: false,
        // max_new_tokens: 1000,
        // max_new_tokens: 512,
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
    const endTime = performance.now();
    console.info(`LLM inference time: ${endTime - initTime}`);
    console.info('LLM result: ', result);

    postMessage(result);
  } catch (error) {
    if (error instanceof Error) {
      postMessage({ error: error.message });
    }
    console.error('LLM worker error:', error);
  }
};
