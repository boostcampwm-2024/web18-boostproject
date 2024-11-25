import { HttpException, HttpStatus } from '@nestjs/common';

export class BaseException extends HttpException {
  constructor(
    message: string,
    status: HttpStatus,
    code?: string,
    details?: Record<string, any>,
  ) {
    const response = {
      status,
      message,
      code,
      timestamp: new Date().toISOString(),
      details,
    };
    super(response, status);
  }
}
