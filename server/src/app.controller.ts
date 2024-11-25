import { Controller, Get, Inject, Post } from '@nestjs/common';
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
    await this.redisClient.set('inear', '인이어임다');
    const value = await this.redisClient.get('inear');
    return { success: true, value };
  }

  @ApiOperation({ summary: 'health check' })
  @Get('/health')
  healthCheck() {
    return { success: true, health: 'healthy' };
  }
}
