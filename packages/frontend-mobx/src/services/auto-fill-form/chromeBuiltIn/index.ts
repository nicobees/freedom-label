import { initialPrompts, prompts, systemPrompt } from '../constants';

type LlmOptions = {
  temperature: number;
  topK: number;
};

export class AutoFillChromeBuiltIn {
  private static initialUserPrompts = initialPrompts;
  private static session: LanguageModel | null = null;
  private static sessionJson: LanguageModel | null = null;
  // options: LlmOptions;
  private static systemPrompt = {
    content: systemPrompt,
    role: 'system',
  } satisfies LanguageModelSystemMessage;

  // constructor(options: LlmOptions = { temperature: 0.0, topK: 1 }) {
  //   // setup main options for the model
  //   this.options = options;
  // }

  static async getInstance() {
    try {
      if (!this.session) {
        this.session = await this.init();
      }

      return this.session;
    } catch (error) {
      console.error('Error getting instance auto fill chrome built in:', error);
    }
  }

  static async init(options: LlmOptions = { temperature: 0.0, topK: 2 }) {
    if (!('LanguageModel' in self)) {
      throw new Error('LanguageModel API not available in the browser');
    }
    const available = await LanguageModel.availability();

    if (available === 'unavailable') {
      throw new Error(
        'Chrome Built-in AI is not available. Enable chrome://flags/#prompt-api-for-gemini-nano',
      );
    }

    const initialPrompts = [
      this.systemPrompt,
      ...this.initialUserPrompts,
    ] satisfies LanguageModelCreateOptions['initialPrompts'];

    this.session = await LanguageModel.create({
      initialPrompts,
      monitor(m) {
        m.addEventListener('downloadprogress', (e) => {
          console.info('Chrome built-in model download progress: ', e.loaded);
        });
      },
      ...options,
    });

    return this.session;
  }

  static async prompt(userPrompt: string) {
    try {
      const prompt = userPrompt || prompts[7];
      console.info('inside chrome built in prompt: ', prompt);

      const agent = await AutoFillChromeBuiltIn.getInstance();

      if (!agent) {
        throw new Error('Agent not initialised');
      }

      const initTime = performance.now();
      const result = await agent.prompt(
        prompt,
        // {
        //   responseConstraint: responseSchema,
        // },
      );

      console.info(result);
      // Step 5: Parse guaranteed-valid JSON
      // const parsed = result.replace('```json', '').replace('```', '');
      // const extracted = JSON.parse(parsed) as Record<string, unknown>;

      // console.log('Extracted data:', extracted);

      // const parsedJson = await this.sessionJson.prompt(`${parsed}`);

      // console.info('parsed json: ', parsedJson, this.session, this.sessionJson);

      // return extracted;
      const endTime = performance.now();
      console.info(`LLM inference time: ${endTime - initTime}`);
      console.info('result: ', result);
    } catch (error) {
      console.error('LLM chrome built in error:', error);
    }
  }
}
