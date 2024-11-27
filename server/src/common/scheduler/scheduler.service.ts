import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { REDIS_CLIENT } from '../redis/redis.module';
import { RedisClientType } from 'redis';
import { AlbumRepository } from '@/album/album.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  private readonly MINUTES = 30;
  private readonly ROOM_ID: string;
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly albumRepository: AlbumRepository,
    private readonly configService: ConfigService,
  ) {
    this.ROOM_ID = this.configService.get<string>('TEST_ROOM_ID');
  }

  @Cron('25,55 * * * *')
  async updateReleaseTimestamp() {
    const currentTime = new Date();
    console.log(
      `SCHEDULAR EXECUTED TO UPDATE TIME, Current time (KST): ${currentTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
    );
    try {
      const sessionKey = `rooms:${this.ROOM_ID}:session`;
      const releaseTimestamp = await this.redisClient.hGet(
        sessionKey,
        'releaseTimestamp',
      );
      if (releaseTimestamp) {
        const newTimestamp =
          parseInt(releaseTimestamp) + this.MINUTES * 60 * 1000;
        await this.redisClient.hSet(
          sessionKey,
          'releaseTimestamp',
          newTimestamp.toString(),
        );
        console.log(
          `Updated Redis releaseTimestamp to: ${new Date(newTimestamp).toISOString()}`,
        );

        await this.albumRepository.updateReleaseDate(
          this.ROOM_ID,
          this.MINUTES,
        );
        console.log(`Updated Album releaseDate by ${this.MINUTES} minutes`);
      }
    } catch (error) {
      console.error('Redis, MySQL 시간 업데이트 실패', error);
    }
  }
}
