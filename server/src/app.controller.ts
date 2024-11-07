import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/common/redis/redis.module';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  @ApiOperation({ summary: '기본' })
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
