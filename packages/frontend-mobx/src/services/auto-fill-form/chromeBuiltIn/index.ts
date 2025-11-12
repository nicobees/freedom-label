import { initialPrompts, systemPrompt } from '../constants';

type GetInstanceProps = Pick<InitProps, 'initProgressCallback'>;

type InitProps = {
  initProgressCallback?: (progress: number) => void;
  options?: LlmOptions;
};

type LlmOptions = {
  temperature: number;
  topK: number;
};

type PromptReturnType =
  | {
      error: string;
      result?: never;
    }
  | {
      error?: never;
      result: string;
    };

export const isErrorReturnType = (
  obj: PromptReturnType,
): obj is { error: string } => {
  return 'error' in obj;
};

export class AutoFillChromeBuiltIn {
  private static abortController: AbortController = new AbortController();
  private static initialUserPrompts = initialPrompts;
  private static session: LanguageModel | null = null;

  private static systemPrompt = {
    content: systemPrompt,
    role: 'system',
  } satisfies LanguageModelSystemMessage;

  static async getInstance({ initProgressCallback }: GetInstanceProps = {}) {
    try {
      if (!this.session) {
        this.session = await this.init({ initProgressCallback });
      }

      return this.session;
    } catch (error) {
      console.error('Error getting instance auto fill chrome built in:', error);
    }
  }

  static async init({
    initProgressCallback,
    options = { temperature: 0.0, topK: 2 },
  }: InitProps = {}) {
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
          initProgressCallback?.(100 * e.loaded);
        });
      },
      ...options,
    });

    return this.session;
  }

  static async prompt(userPrompt: string): Promise<PromptReturnType> {
    try {
      const prompt = userPrompt;

      const agent = await AutoFillChromeBuiltIn.getInstance();

      if (!agent) {
        throw new Error('Agent not initialised');
      }

      const initTime = performance.now();
      const result = await agent.prompt(
        prompt,
        {
          signal: this.abortController.signal,
        },
        // {
        //   responseConstraint: responseSchema,
        // },
      );

      // console.info(result);

      const endTime = performance.now();
      console.info(`LLM inference time: ${endTime - initTime}`);

      if (!result) {
        return { error: 'No result from LLM' };
      }

      return { result };
    } catch (error) {
      const message = 'Error in LLM';
      const errorMessage =
        error instanceof Error
          ? `LLM chrome built-in error: ${error.message}`
          : String(error);
      console.error(errorMessage, error);

      return { error: message };
    }
  }

  static resetPrompt() {
    this.abortController.abort();
  }
}
