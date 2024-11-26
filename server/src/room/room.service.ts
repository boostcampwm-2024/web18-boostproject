import { Inject, Injectable } from '@nestjs/common';
import { MusicRepository } from '@/music/music.repository';
import { Room } from '@/room/room.entity';
import { RoomRepository } from '@/room/room.repository';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RedisClientType } from 'redis';
import { AlreadyVoteThisRoomException } from '@/common/exceptions/domain/vote/already-vote-this-room.exception';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly musicRepository: MusicRepository,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  async getTrackOrder(roomId: string): Promise<string> {
    // return await this.musicRepository
    //   .findSongByJoinTimestamp(roomId, Date.now())
    //   .then((data) => data.id);
    return await this.musicRepository
      .findSongByJoinTimestamp(roomId, 1700000000000)
      .then((data) => data.id);
  }

  async initializeRoom(albumId: string) {
    await this.roomRepository.createRoom(
      // new Room({ id: albumId, createdAt: new Date() }),
      new Room({ id: albumId, createdAt: new Date(1700000000000) }),
    );
  }

  async updateVote(roomId: string, trackNumber: string, identifier: string) {
    if (await this.redisClient.hExists(`room:${roomId}`, identifier)) {
      throw new AlreadyVoteThisRoomException(roomId);
    }

    await this.redisClient.hIncrBy(`room:${roomId}:votes`, trackNumber, 1);
    await this.redisClient.hSet(`room:${roomId}`, identifier, 'true');
    await this.redisClient.hExpire(`room:${roomId}`, identifier, 60 * 60 * 24);
  }

  async getVoteResult(roomId: string) {
    const voteResult = await this.redisClient.hGetAll(`room:${roomId}:votes`);
    const songDurations = await this.redisClient.hGet(
      `rooms:${roomId}:session`,
      'songs',
    );
    const songCount = JSON.parse(songDurations).length;
    for (let songIndex = 1; songIndex <= songCount; songIndex++) {
      if (!voteResult[songIndex]) {
        voteResult[songIndex] = '0';
      }
    }

    return voteResult;
  }
}
