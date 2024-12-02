import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { REDIS_CLIENT } from '../redis/redis.module';
import { RedisClientType } from 'redis';
import { AlbumRepository } from '@/album/album.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchedulerService {
  private readonly MINUTES = 5;
  private readonly ROOM_ID: string;
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly albumRepository: AlbumRepository,
    private readonly configService: ConfigService,
  ) {
    this.ROOM_ID = this.configService.get<string>('TEST_ROOM_ID');
  }

  @Cron('*/5 * * * *')
  async updateReleaseTimestamp() {
    const currentTime = new Date();
    console.log(
      `SCHEDULAR EXECUTED TO UPDATE TIME, Current time (KST): ${currentTime.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`,
    );
    try {
      await this.albumRepository.updateReleaseDate(this.ROOM_ID, this.MINUTES);
      const updatedMySQLTime = await this.albumRepository.getReleaseDate(
        this.ROOM_ID,
      );

      const sessionKey = `rooms:${this.ROOM_ID}:session`;
      const redisTimestamp = await this.redisClient.hGet(
        sessionKey,
        'releaseTimestamp',
      );

      if (redisTimestamp) {
        const redisTime = parseInt(redisTimestamp);
        const mysqlTime = updatedMySQLTime.getTime();
        console.log('Updated MySQL time: ', updatedMySQLTime);

        if (redisTime !== mysqlTime) {
          await this.redisClient.hSet(
            sessionKey,
            'releaseTimestamp',
            mysqlTime.toString(),
          );
          console.log(
            `Updated Redis releaseTimestamp to match MySQL: ${new Date(mysqlTime).toISOString()}`,
          );
        }
      }
    } catch (error) {
      console.error('Redis, MySQL 시간 업데이트 실패', error);
    }
  }
}
