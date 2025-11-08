import { useCallback, useEffect, useRef } from 'react';

import { AutoFillChromeBuiltIn } from '../services/auto-fill-form/chromeBuiltIn';

type UseAutoFillProps = {
  enabled: boolean;
};

export const useAutoFill = (
  { enabled }: UseAutoFillProps = { enabled: true },
) => {
  const initialised = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      initialised.current = false;
      return;
    }

    const init = async function () {
      await AutoFillChromeBuiltIn.getInstance();
      initialised.current = true;
    };

    void init();
  }, [enabled]);

  const prompt = useCallback(async (userPrompt: string) => {
    try {
      if (!initialised.current) {
        return;
      }
      const result = await AutoFillChromeBuiltIn.prompt(userPrompt);

      return result;
    } catch (error) {
      console.error('LLM prompt failed:', error);
    }
  }, []);

  return { prompt };
};
