import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseException } from '@/common/exceptions/base.exception';

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
        time: new Date().toISOString(),
        ...this.getExceptionResponse(exception),
      });
    }
    // 예상치 못한 예외 처리
    this.logException(exception, { path: request.url });
    return this.getUnexpectedExceptionResponse(exception, response);
  }

  private getExceptionResponse(exception: any): Record<string, any> {
    const exceptionResponse = exception.getResponse();
    return exceptionResponse instanceof Object
      ? exceptionResponse
      : { message: exceptionResponse };
  }

  private getUnexpectedExceptionResponse(exception: any, response: Response) {
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: exception.constructor.name,
      errorCode: exception.code,
      message: exception.message,
      time: exception.time,
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
