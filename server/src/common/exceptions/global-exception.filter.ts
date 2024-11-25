import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof BaseException) {
      this.logException(exception, { path: request.url });
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    // 예상치 못한 예외 처리
    this.logException(exception, { path: request.url });
    return this.getUnexpectedExceptionResponse(response);
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
