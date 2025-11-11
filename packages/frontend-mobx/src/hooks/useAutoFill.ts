import isEmpty from 'lodash/isEmpty';
import set from 'lodash/set';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { LabelData } from '../validation/schema';

import { AutoFillChromeBuiltIn } from '../services/auto-fill-form/chromeBuiltIn';

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

  return { parsed: output as LabelData, parsedAsStrings };
};

export type UseAutoFillProps = {
  autoFillFormCallback?: (data: LabelData) => void;
  enabled: boolean;
};

export const useAutoFill = (
  { autoFillFormCallback, enabled }: UseAutoFillProps = { enabled: false },
) => {
  const { t } = useTranslation();
  const initialisedRef = useRef<boolean>(false);
  const [initialised, setInitialised] = useState<boolean>(false);
  const [initProgress, setInitProgress] = useState<null | number>(null);
  const [loading, setLoading] = useState<null | string>(null);

  useEffect(() => {
    if (!enabled) {
      initialisedRef.current = false;
      setInitialised(false);
      return;
    }

    const init = async function () {
      setLoading(t('initAiMode'));
      await AutoFillChromeBuiltIn.getInstance({
        initProgressCallback: (progress) => {
          setInitProgress(progress);
        },
      });
      initialisedRef.current = true;
      setInitialised(true);
      setLoading(null);
    };

    void init();
  }, [enabled, initialised, setLoading, t]);

  const prompt = useCallback(
    async (userPrompt: string) => {
      try {
        if (!initialisedRef.current || !initialised) {
          return;
        }
        setLoading(t('processingRequest'));
        const { error, result } =
          await AutoFillChromeBuiltIn.prompt(userPrompt);

        if (error || !result) {
          setLoading(null);
          return error;
        }

        const { parsed, parsedAsStrings } = parseResult(result);

        // console.info('in useAutoFill: ', result, parsed, parsedAsStrings);

        if (isEmpty(parsed) || !parsedAsStrings.length) {
          setLoading(null);
          return 'No match found in your instructions. Try again following this format and examples (TODO)';
        }

        autoFillFormCallback?.(parsed);

        const matchMessage =
          'I found a match and I filled the form accordingly.';
        const detailMessage = 'Check below the matching details';
        const resultMessage = `${matchMessage}\n${detailMessage}\n\n${parsedAsStrings.join('\n')}`;

        setLoading(null);
        return resultMessage;
      } catch (error) {
        console.error('LLM prompt failed:', error);
      }
    },
    [autoFillFormCallback, initialised, t],
  );

  return { initialised, initProgress, loading, prompt };
};
