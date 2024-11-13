import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { RandomNameUtil } from '@/common/randomname/random-name.util';

export class UserRepository {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async findById(userId: string) {
    return await this.redisClient.hGet(userId, 'name');
  }

  async create(userId: string) {
    if (await this.findById(userId) == null) {
      const randomName = RandomNameUtil.generate();
      await this.redisClient.hSet(userId, 'name',randomName);
    }
  }
}
