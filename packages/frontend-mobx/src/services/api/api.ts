import { useMutation } from '@tanstack/react-query';

import type { LabelDataSubmit } from '../../validation/schema';

import { isApiError } from '../../utils/exceptions';
import { apiFetch, getFullUrl, type SuccessResponse } from './helpers';

export const useCreatePrintMutation = ({
  onMutationHandler,
}: {
  onMutationHandler: (
    error?: string,
    filename?: SuccessResponse['pdf_filename'],
  ) => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (data: LabelDataSubmit) => {
      const url = getFullUrl('label/create-print');

      return apiFetch<SuccessResponse>(url, {
        body: JSON.stringify(data),
        method: 'POST',
      });
    },
    onError: (error) => {
      console.error(error);

      if (isApiError(error)) {
        onMutationHandler(error.getMessageDetail());
        return;
      }

      onMutationHandler(error.message);
    },
    onSuccess: (responseData) => {
      onMutationHandler(undefined, responseData.pdf_filename);
    },
  });

  return { loading: mutation.isPending, mutate: mutation.mutate };
};
