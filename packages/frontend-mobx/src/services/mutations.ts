import { useMutation, type UseMutationOptions } from '@tanstack/react-query';

import { apiFetch, getFullUrl } from './api';

type PrintLabelRequest = { pdf_path: string };
type PrintLabelResponse = { pdf_filename: string; status: 'ok' };

export function usePrintLabelMutation(
  options?: Omit<
    UseMutationOptions<PrintLabelResponse, Error, PrintLabelRequest>,
    'mutationFn'
  >,
) {
  return useMutation({
    mutationFn: (body: PrintLabelRequest) =>
      apiFetch<PrintLabelResponse>(getFullUrl('/label/print'), {
        body: JSON.stringify(body),
        method: 'POST',
      }),
    ...options,
  });
}
