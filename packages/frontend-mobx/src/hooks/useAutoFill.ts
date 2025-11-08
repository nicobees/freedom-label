import set from 'lodash/set';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { LabelData } from '../validation/schema';

import { AutoFillChromeBuiltIn } from '../services/auto-fill-form/chromeBuiltIn';

export type UseAutoFillProps = {
  autoFillFormCallback?: (data: LabelData) => void;
  enabled: boolean;
};

const parseResult = (
  llmResult: string,
): {
  original: string;
  parsed: LabelData;
} => {
  const regex = /\{([^}]+)\}:\s*([^\n\r]+)/g;

  const output = {};
  let leftEnabled = false;
  let rightEnabled = false;

  const matches = [...llmResult.matchAll(regex)];
  matches.forEach((match) => {
    const keyPath = match[1];
    const value = match[2];

    if (keyPath.includes('left')) {
      leftEnabled = true;
    }
    if (keyPath.includes('right')) {
      rightEnabled = true;
    }

    set(output, keyPath, value);
  });

  if (!leftEnabled) {
    set(output, 'lens_specs.left.enabled', false);
    set(output, 'lens_specs.left.data', null);
  }

  if (!rightEnabled) {
    set(output, 'lens_specs.right.enabled', false);
    set(output, 'lens_specs.right.data', null);
  }

  /**
   * - {patient_info.name}: Marco
      - {patient_info.surname}: Verdi
      - {lens_specs.[right].data.pwr}: -1.73
      - {lens_specs.[right].data.dia}: 3
      - {lens_specs.[right].data.bc}: 2.1
      - {lens_specs.[right].data.ax}: 180
      - {lens_specs.[right].data.batch}: late-2025
      - {lens_specs.[right].data.sag_toric}: 749
   */
  // const data = {
  //   lens_specs: {
  //     left: { data: null, enabled: false },
  //     right: {
  //       data: {
  //         ax: '180',
  //         batch: 'late-2025',
  //         bc: '2.1',
  //         dia: '3',
  //         pwr: '-1.73',
  //         sag_toric: '749',
  //       },
  //       enabled: true,
  //     },
  //   },
  //   patient_info: {
  //     name: 'Marco',
  //     surname: 'Verdi',
  //   },
  // };

  return { original: llmResult, parsed: output } as {
    original: string;
    parsed: LabelData;
  };
};

export const useAutoFill = (
  { autoFillFormCallback, enabled }: UseAutoFillProps = { enabled: true },
) => {
  const initialised = useRef<boolean>(false);
  const [initialisedState, setInitialisedState] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      initialised.current = false;
      setInitialisedState(false);
      return;
    }

    const init = async function () {
      await AutoFillChromeBuiltIn.getInstance();
      initialised.current = true;
      setInitialisedState(true);
    };

    void init();
  }, [enabled, initialisedState]);

  const prompt = useCallback(
    async (userPrompt: string) => {
      try {
        if (!initialised.current || !initialisedState) {
          return;
        }
        const result = await AutoFillChromeBuiltIn.prompt(userPrompt);

        if (!result) {
          return 'I was unable to find a match with AI';
        }

        const { original, parsed } = parseResult(result);

        autoFillFormCallback?.(parsed);

        return original;
      } catch (error) {
        console.error('LLM prompt failed:', error);
      }
    },
    [autoFillFormCallback, initialisedState],
  );

  return { initialised: initialisedState, prompt };
};
