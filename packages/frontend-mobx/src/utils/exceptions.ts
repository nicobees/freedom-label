// Custom error for network requests with statusCode and optional details payload
const API_ERROR_NAME = 'ApiError';

export class ApiError extends Error {
  readonly detail?: string;
  readonly statusCode: number;

  constructor(statusCode: number, detail?: string) {
    super(`${API_ERROR_NAME}: ${statusCode} - ${detail ?? ''}`.trim());
    this.name = API_ERROR_NAME;
    this.statusCode = statusCode;
    this.detail = detail;
    this.message = this.formatMessage();
    // Restore prototype chain when targeting ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }

  getMessageDetail() {
    return `${this.detail}`.trim();
  }

  private formatMessage(
    name = this.name,
    statusCode = this.statusCode,
    detail = this.detail,
  ) {
    const detailFormatted = detail ? ` - ${detail}` : '';
    return `[${statusCode}] - ${name}: ${detailFormatted}`.trim();
  }
}

export function isApiError(error: unknown): error is ApiError {
  return (
    error instanceof Error &&
    (error as ApiError).name === API_ERROR_NAME &&
    typeof (error as ApiError).statusCode === 'number'
  );
}
