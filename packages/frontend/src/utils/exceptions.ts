// Custom error for network requests with statusCode and optional details payload
export class NetworkError extends Error {
  readonly details?: unknown;
  readonly statusCode: number;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = statusCode;
    this.details = details;
    // Restore prototype chain when targeting ES5
    Object.setPrototypeOf(this, new.target.prototype);
  }

  formatMessage() {
    return `NetworkError: ${this.message} (status code: ${this.statusCode})`;
  }
}

export function isNetworkError(error: unknown): error is NetworkError {
  return (
    error instanceof Error &&
    (error as NetworkError).name === 'NetworkError' &&
    typeof (error as NetworkError).statusCode === 'number'
  );
}
