import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const originalSend = res.send;
    const logger = this.logger;

    //@ts-ignore
    res.send = (...args: any[]) => {
      const [body] = args;
      if (typeof body === 'string') {
        logger.log(`Response Body: ${body}`);
      }
      originalSend.apply(res, args);
    };

    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(`${ip} ${method} ${originalUrl} ${statusCode}`);
      if (Object.keys(req.body).length !== 0) {
        this.logger.log(`Request body: ${JSON.stringify(req.body)}`);
      }
    });
    next();
  }
}
