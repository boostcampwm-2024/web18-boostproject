import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisClientType } from 'redis';

export interface SongMetadata {
  id: string;
  startTime: number;
  duration: number;
}


// 노래 하나 하나 따로 저장되어있다고 가정 song : { id : 1, startTime : 123212313, duration : 180}
@Injectable()
export class MusicRepository {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  private songKey(songId: string): string {
    return `songs:${songId}`;
  }

  async getSongMetadata(songId: string): Promise<SongMetadata> {
    const songKey = this.songKey(songId);
    const exists = await this.redisClient.exists(songKey);
    
    if (!exists) {
      throw new NotFoundException(`Song ${songId} not found`);
    }

    const [id, startTime, duration] = await Promise.all([
      this.redisClient.hGet(songKey, 'id'),
      this.redisClient.hGet(songKey, 'startTime'),
      this.redisClient.hGet(songKey, 'duration'),
    ]);

    if (!id || !startTime || !duration) {
      throw new NotFoundException(`Invalid Song ${songId} values`);
    }

    return {
      id,
      startTime: parseInt(startTime, 10),
      duration: parseInt(duration, 10),
    };
  }
}