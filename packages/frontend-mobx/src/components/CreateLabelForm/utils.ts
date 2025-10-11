import type { ValidationError } from '@tanstack/react-form';

export const formatValidationError = (error: ValidationError): string => {
  if (typeof error === 'string') return error;

  const maybeMsg = (error as { message?: unknown })?.message;
  if (typeof maybeMsg === 'string') return maybeMsg;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};
