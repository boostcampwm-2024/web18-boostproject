import { Controller, Get, Inject, Logger, LoggerService } from '@nestjs/common';
import { AppService } from '@/app.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RedisClientType } from 'ioredis';
import { REDIS_CLIENT } from '@/common/redis/redis.module';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  @ApiOperation({ summary: '기본' })
  @Get()
  getHello(): any {
    this.logger.log('Hello??');
    return { result: 123 };
    // return this.appService.getHello();
  }

  @Get('/redis')
  async testRedis(): Promise<any> {
    try {
      await this.redisClient.set('inear', '인이어임다');
      const value = await this.redisClient.get('inear');
      return { success: true, value };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
