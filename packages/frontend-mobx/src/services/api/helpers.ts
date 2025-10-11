import { ApiError } from '../../utils/exceptions';

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

export type SuccessResponse = {
  pdf_filename: string;
  status: 'ok';
};

type ApiResponse = ErrorResponse | SuccessResponse;

type ErrorResponse = {
  detail: string;
};

const isErrorResponse = (data: ApiResponse): data is ErrorResponse => {
  return !!(data as ErrorResponse)?.detail;
};

export const apiFetch = async <T extends ApiResponse>(
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

  const data = (await response.json()) as T;

  if (!response.ok) {
    if (isErrorResponse(data)) {
      throw new ApiError(response.status, data.detail);
    }

    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};
