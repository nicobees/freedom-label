import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useFeedback } from '../contexts/FeedbackContext';

export const usePrintLabelApiResponse = () => {
  const { showError, showSuccess } = useFeedback();

  const { t } = useTranslation();

  const handleMessage = useCallback(
    (errorMessage?: string, filename?: string) => {
      const messageBaseLabel = errorMessage
        ? 'errorInPrintingLabel'
        : 'labelPrintedSuccessfully';
      const messageBase = t(messageBaseLabel);
      const detailMessage = errorMessage ? errorMessage : filename;

      const fullMessage = detailMessage
        ? `${messageBase}: ${detailMessage}`
        : messageBase;
      const method = errorMessage ? showError : showSuccess;

      console.info('handle message');
      method(fullMessage);
    },
    [showError, showSuccess, t],
  );

  return handleMessage;
};
