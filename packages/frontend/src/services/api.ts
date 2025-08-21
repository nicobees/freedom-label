import type {
  UseMutationOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import type { LabelDataSubmit } from '../validation/schema';

const BASE_URL = import.meta.env?.VITE_BACKEND_URL ?? '';

if (!BASE_URL && typeof window !== 'undefined') {
  // eslint-disable-next-line no-console
  console.warn('VITE_BACKEND_URL is not defined. API calls will likely fail.');
}

type CreateLabelResponse = { pdf_filename: string; status: 'ok' };
type HealthStatus = { status: string };
type PrintLabelRequest = { pdf_path: string };
type PrintLabelResponse = { pdf_filename: string; status: 'ok' };

const joinUrl = (path: string) => {
  const base = BASE_URL ?? '';
  if (!base) return path;
  // Ensure exactly one slash between base and path
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base.replace(/\/$/, '')}${p}`;
};

export function useApiBaseUrl() {
  // Expose the resolved base URL to components for debugging or composing links
  return useMemo(() => BASE_URL ?? '', []);
}

export function useCreateLabelMutation(
  options?: Omit<
    UseMutationOptions<
      CreateLabelResponse,
      Error,
      { body: LabelDataSubmit; debug_border?: 0 | 1 }
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    body,
    debug_border,
  }: {
    body: LabelDataSubmit;
    debug_border?: 0 | 1;
  }) => {
    const params = new URLSearchParams();
    if (typeof debug_border !== 'undefined')
      params.set('debug_border', String(debug_border));
    const qs = params.toString();
    const base = joinUrl('/label/create');
    const url = qs ? `${base}?${qs}` : base;
    return apiFetch<CreateLabelResponse>(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });
  };
  return useMutation({ mutationFn, ...options });
}

export function useCreatePrintLabelMutation(
  options?: Omit<
    UseMutationOptions<
      CreateLabelResponse,
      Error,
      { body: LabelDataSubmit; debug?: 'no-print'; debug_border?: 0 | 1 }
    >,
    'mutationFn'
  >,
) {
  const mutationFn = async ({
    body,
    debug,
    debug_border,
  }: {
    body: LabelDataSubmit;
    debug?: 'no-print';
    debug_border?: 0 | 1;
  }) => {
    const params = new URLSearchParams();
    if (debug) params.set('debug', debug);
    if (typeof debug_border !== 'undefined')
      params.set('debug_border', String(debug_border));
    const qs = params.toString();
    const base = joinUrl('/label/create-print');
    const url = qs ? `${base}?${qs}` : base;
    return apiFetch<CreateLabelResponse>(url, {
      body: JSON.stringify(body),
      method: 'POST',
    });
  };
  return useMutation({ mutationFn, ...options });
}

export function useHealthQuery(
  options?: Omit<
    UseQueryOptions<HealthStatus, Error, HealthStatus, ['health']>,
    'queryFn' | 'queryKey'
  >,
) {
  return useQuery({
    queryFn: () => apiFetch<HealthStatus>(joinUrl('/health')),
    queryKey: ['health'],
    ...options,
  });
}

export function usePrintLabelMutation(
  options?: Omit<
    UseMutationOptions<PrintLabelResponse, Error, PrintLabelRequest>,
    'mutationFn'
  >,
) {
  return useMutation({
    mutationFn: (body: PrintLabelRequest) =>
      apiFetch<PrintLabelResponse>(joinUrl('/label/print'), {
        body: JSON.stringify(body),
        method: 'POST',
      }),
    ...options,
  });
}

async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  // Try to parse JSON either on success or error
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : ({} as unknown);

  if (!res.ok) {
    const message =
      typeof data === 'object' &&
      data &&
      'detail' in (data as Record<string, unknown>)
        ? String((data as Record<string, unknown>).detail)
        : `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}
