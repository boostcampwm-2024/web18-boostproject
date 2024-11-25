import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      this.logException(exception, { path: request.url });
      return response.status(exception.getStatus()).json({
        ...this.getExceptionResponse(exception),
        timestamp: new Date().toISOString(),
      });
    }
    // 예상치 못한 예외 처리
    this.logException(exception, { path: request.url });
    return this.getUnexpectedExceptionResponse(response);
  }

  private getExceptionResponse(exception: any): Record<string, any> {
    const exceptionResponse = exception.getResponse();
    return exceptionResponse instanceof Object
      ? exceptionResponse
      : { message: exceptionResponse };
  }

  private getUnexpectedExceptionResponse(response: Response) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: '서버 내부 오류가 발생했습니다.',
      timestamp: new Date().toISOString(),
    });
  }

  private logException(exception: any, requestInfo: any) {
    this.logger.error({
      type: exception.constructor.name,
      message: exception.message,
      ...requestInfo,
    });
  }
}
