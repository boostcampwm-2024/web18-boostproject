import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {}

  @ApiOperation({ summary: '기본' })
  @Get()
  getHello(): any {
    this.logger.log('Hello??');
    return { result: 123 };
    // return this.appService.getHello();
  }
}
