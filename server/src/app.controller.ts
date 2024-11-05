import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): any {
    this.logger.log('Hello??');
    return { result: 123 };
    // return this.appService.getHello();
  }
}
