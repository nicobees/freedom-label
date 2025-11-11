import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { LabelData } from '../validation/schema';

import {
  AutoFillChromeBuiltIn,
  isErrorReturnType,
} from '../services/auto-fill-form/chromeBuiltIn';

const fieldMapping = {
  ax: 'axis',
  batch: 'production_batch',
  bc: 'base curve',
  bc_toric: 'base curve toric',
  cyl: 'cylinder',
  dia: 'diameter',
  pwr: 'power',
  sag: 'sagittal',
  sag_toric: 'sagittal toric',
};

const parseKeyAndValue = (keyPath: string, value: string) => {
  if (keyPath === 'description') {
    return `- {${keyPath}}: ${value}`;
  }
  if (keyPath.includes('patient_info')) {
    const keyPathParts = keyPath.split('.');
    const field = keyPathParts[keyPathParts.length - 1];
    return `- Patient ${field}: ${value}`;
  }
  if (keyPath.includes('lens_specs')) {
    const keyPathParts = keyPath.split('.');
    // eslint-disable-next-line sonarjs/single-character-alternation
    const lensSide = keyPathParts[1].replace(/\[|\]/g, '');
    const field = keyPathParts[
      keyPathParts.length - 1
    ] as keyof typeof fieldMapping;
    const fieldMapped = fieldMapping[field] || field;
    return `- ${lensSide.charAt(0).toUpperCase() + lensSide.slice(1)} lens ${fieldMapped}: ${value}`;
  }
  return `- {${keyPath}}: ${value}`;
};

const parseResult = (
  llmResult: string,
): {
  parsed: LabelData;
  parsedAsStrings: string[];
} => {
  // eslint-disable-next-line sonarjs/slow-regex
  const regex = /\{([^}]+)\}:\s*([^\n\r]+)/g;

  const output = {};
  let leftEnabled = false;
  let rightEnabled = false;
  const parsedAsStrings: string[] = [];

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
    const isDecimalKey = ['pwr', 'bc', 'dia', 'add', 'cyl', 'bc_toric'].some(
      (field) => keyPath.includes(field),
    );
    const parsedValue =
      keyPath.includes('lens_specs') && isDecimalKey
        ? Number(value).toFixed(2).toString()
        : value;

    set(output, keyPath, parsedValue);
    parsedAsStrings.push(parseKeyAndValue(keyPath, value));
  });

  if (!leftEnabled && !!matches.length) {
    set(output, 'lens_specs.left.enabled', false);
    set(output, 'lens_specs.left.data', null);
  }

  if (!rightEnabled && !!matches.length) {
    set(output, 'lens_specs.right.enabled', false);
    set(output, 'lens_specs.right.data', null);
  }

  return { parsed: output as LabelData, parsedAsStrings };
};

export type AiMessage<T extends AiMessageVariants = AiMessageVariants> = {
  content: string;
  type: T;
};

export type AiMessageVariants =
  | 'error'
  | 'example'
  | 'match'
  | 'transcript'
  | 'user';

export type UseAutoFillProps = {
  autoFillFormCallback?: (data: LabelData) => void;
};

export const useAutoFill = ({ autoFillFormCallback }: UseAutoFillProps) => {
  const { t } = useTranslation();

  const [initialised, setInitialised] = useState<boolean>(false);
  const [initProgress, setInitProgress] = useState<null | number>(null);
  const [loading, setLoading] = useState<null | string>(null);

  const initAiModeLabel = t('initAiMode');

  const deactivate = useCallback(() => {
    if (initialised) {
      setInitialised(false);
      AutoFillChromeBuiltIn.resetPrompt();
    }
  }, [initialised]);

  const init = useCallback(async () => {
    if (initialised) {
      return;
    }

    setLoading(initAiModeLabel);
    await AutoFillChromeBuiltIn.getInstance({
      initProgressCallback: (progress) => {
        setInitProgress(progress);
      },
    });

    setInitialised(true);
    setLoading(null);
  }, [initAiModeLabel, initialised]);

  const prompt = useCallback(
    async (userPrompt: string): Promise<AiMessage[]> => {
      try {
        if (!initialised) {
          return [{ content: t('aiModeNotInitialised'), type: 'error' }];
        }
        setLoading(t('processingRequest'));
        const promptResult = await AutoFillChromeBuiltIn.prompt(userPrompt);

        if (isErrorReturnType(promptResult)) {
          const { error } = promptResult;
          setLoading(null);
          return [{ content: error, type: 'error' }];
        }

        const { result } = promptResult;
        const { parsed, parsedAsStrings } = parseResult(result);

        if (isEmpty(parsed) || !parsedAsStrings.length) {
          setLoading(null);
          const infoMessageHeader =
            'No matches found in your instructions. Please try again.';
          return [
            {
              content: `${infoMessageHeader}`,
              type: 'error',
            },
          ];
        }

        autoFillFormCallback?.(parsed);

        const matchMessage = `${t('successfullyFoundMatchesAndFilledForm')}.`;
        const detailMessage = t('checkBelowForMatchingDetails');
        const resultMessage = {
          content: `${matchMessage}\n${detailMessage}\n\n${parsedAsStrings.join('\n')}`,
          type: 'match',
        } as const;

        setLoading(null);
        return [resultMessage];
      } catch (error) {
        console.error('Error in AI handler:', error);

        setLoading(null);
        return [{ content: t('errorInAiHandler'), type: 'error' }];
      }
    },
    [autoFillFormCallback, initialised, t],
  );

  return { deactivate, init, initialised, initProgress, loading, prompt };
};
