import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { RedisClientType } from 'redis';

interface RoomSession {
  releaseTimestamp: number;
  songs: number[];
}

interface SongMetadata {
  id: string;
  startTime: number;
  duration: number;
}

@Injectable()
export class MusicRepository {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  private albumKey(albumId: string): string {
    return `rooms:${albumId}:session`;
  }

  private async getRoomSession(albumId: string): Promise<RoomSession> {
    const albumKey = this.albumKey(albumId);
    const exists = await this.redisClient.exists(albumKey);

    if (!exists) {
      throw new NotFoundException(`Room session ${albumId} not found`);
    }

    const [releaseTimestampStr, songStr] = await Promise.all([
      this.redisClient.hGet(albumKey, 'releaseTimestamp'),
      this.redisClient.hGet(albumKey, 'songs'),
    ]);
    if (!releaseTimestampStr || !songStr) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    return {
      releaseTimestamp: parseInt(releaseTimestampStr, 10),
      songs: JSON.parse(songStr),
    };
  }

  async findSongByJoinTimestamp(
    albumId: string,
    joinTimestamp: number,
  ): Promise<SongMetadata> {
    const session = await this.getRoomSession(albumId);

    let currentTime = session.releaseTimestamp;
    // TODO : 고차함수로 반복
    for (let i = 0; i < session.songs.length; i++) {
      const songEndTime = currentTime + session.songs[i] * 1000;

      if (joinTimestamp >= currentTime && joinTimestamp < songEndTime) {
        return {
          id: `${i + 1}`,
          startTime: currentTime,
          duration: session.songs[i],
        };
      }
      currentTime = songEndTime;
    }
    throw new NotFoundException('No song found for the given timestamp');
  }
}
