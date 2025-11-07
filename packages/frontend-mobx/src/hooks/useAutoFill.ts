import { useCallback, useRef } from 'react';

import { LlmService } from '../services/llm';

type UseAutoFillProps = {
  enabled: boolean;
};

const llmService = new LlmService();

export const useAutoFill = ({ enabled }: UseAutoFillProps) => {
  const initialised = useRef<LanguageModel | null>(null);

  const init = useCallback(async () => {
    if (!enabled || initialised.current) {
      return;
    }

    try {
      await llmService.createSession();
      initialised.current = llmService.session;
    } catch (error) {
      console.error('LLM initialization failed:', error);
    }
  }, [enabled]);

  const prompt = useCallback(async (userPrompt: string) => {
    if (!initialised.current) {
      return;
    }

    try {
      const result = await llmService.prompt(userPrompt);

      return result;
    } catch (error) {
      console.error('LLM prompt failed:', error);
    }
  }, []);

  return { init, prompt };
};
