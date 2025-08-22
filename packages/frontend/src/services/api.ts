import { useMutation } from '@tanstack/react-query';

import type { LabelDataSubmit } from '../validation/schema';

import { isNetworkError, NetworkError } from '../utils/exceptions';

const BASE_URL = import.meta.env?.VITE_BACKEND_URL ?? '';
const IS_PROD = import.meta.env.PROD;

if (!BASE_URL && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn('VITE_BACKEND_URL is not defined. API calls will likely fail.');
}

export const getFullUrl = (path: string) => {
  const base = BASE_URL;

  if (IS_PROD) {
    return `api/${path}`;
  }

  if (!base) return path;

  return `${base}/${path}`;
};

export const apiFetch = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> => {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new NetworkError(
      `API request failed with status ${response.status}`,
      response.status,
    );
  }

  return (await response.json()) as T;
};

export const useCreatePrintMutation = ({
  onMutationHandler,
}: {
  onMutationHandler: (error?: string, data?: LabelDataSubmit) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (data: LabelDataSubmit) => {
      const url = getFullUrl('label/create-print');

      return apiFetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
      });
    },
    onError: (error) => {
      const errorMessage = isNetworkError(error)
        ? error.formatMessage()
        : error.message;
      onMutationHandler(errorMessage);
    },
    onSuccess: (_, data) => {
      onMutationHandler(undefined, data);
    },
  });

  return { mutate: mutation.mutate };
};
