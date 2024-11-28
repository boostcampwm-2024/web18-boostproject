import { useRouteError } from 'react-router-dom';
class APIError extends Error {
  statueCode: number;
  originalError: Error;

  constructor(statueCode: number, message: string, originalError?: Error) {
    super(message);
    this.name = 'APIError';
    this.statueCode = statueCode;
    this.originalError = originalError || new Error(message);
  }
}

export function StreamingErrorPage({ message }: { message?: string }) {
  return (
    <div className="flex flex-row h-screen text-grayscale-100 justify-center items-center w-full"></div>
  );
}
