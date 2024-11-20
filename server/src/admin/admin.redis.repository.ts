import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

export class AdminRedisRepository {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  private getStreamingSessionKey(albumId: string): string {
    return `rooms:${albumId}:session`;
  }

  async createStreamingSession(
    albumId: string,
    releaseTimestamp: number,
    songDurations: number[],
  ): Promise<void> {
    const key = this.getStreamingSessionKey(albumId);
    const multi = this.redisClient.multi();

    multi
      .hSet(key, 'releaseTimestamp', releaseTimestamp.toString())
      .hSet(key, 'songs', JSON.stringify(songDurations));

    await multi.exec();
  }

  async deleteStreamingSession(albumId: string): Promise<void> {
    const key = this.getStreamingSessionKey(albumId);
    await this.redisClient.del(key);
  }
}
