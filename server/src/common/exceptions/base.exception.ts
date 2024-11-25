import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    details?: Record<string, any>,
  ) {
    const response = {
      status,
      message,
      error: HttpStatus[status],
      timestamp: new Date().toISOString(),
      details,
    };
    super(response, status);
  }
}
