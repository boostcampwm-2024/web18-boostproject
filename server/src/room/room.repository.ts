import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Room } from './room.entity';
import { ROOM_STATUS } from '@/room/room.constant';
import { RoomNotFoundException } from '@/common/exceptions/domain/room/room-not-found.exception';
import { RoomIsFullException } from '@/common/exceptions/domain/room/room-is-full.exception';
import { RoomInactiveException } from '@/common/exceptions/domain/room/room-inactive.exception';
import { UserNotInRoomException } from '@/common/exceptions/domain/room/user-not-in-room.exception';

export interface RoomInfo {
  currentUsers: number;
  maxCapacity: number;
  isActive: keyof typeof ROOM_STATUS;
  currentSong: string;
  songs: string[];
}

@Injectable()
export class RoomRepository {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
  ) {}

  private roomKey(roomId: string): string {
    return `rooms:${roomId}`;
  }

  private roomUsersKey(roomId: string): string {
    return `rooms:${roomId}:users`;
  }

  private roomQueueKey(roomId: string): string {
    return `rooms:${roomId}:queue`;
  }

  private roomSessionKey(roomId: string) {
    return `rooms:${roomId}:session`;
  }

  private roomVoteKey(roomId: string) {
    return `rooms:${roomId}:votes`;
  }

  private roomVoteUserKey(roomId: string, identifier: string) {
    return `rooms:${roomId}:votes:${identifier}`;
  }

  async saveVoteUser(roomId: string, identifier: string, trackNumber: string) {
    const key = this.roomVoteUserKey(roomId, identifier);
    await this.redisClient.set(key, trackNumber);
    await this.redisClient.expire(key, 60 * 60 * 24);
  }

  async getRoomVoteUser(roomId: string, identifier: string) {
    const key = this.roomVoteUserKey(roomId, identifier);

    return this.redisClient.get(key);
  }

  async updateVoteByRoomAndIdentifier(
    roomId: string,
    trackNumber: string,
    updateAmount: number,
  ) {
    const key = this.roomVoteKey(roomId);

    await this.redisClient.hIncrBy(key, trackNumber, updateAmount);
  }

  async createRoom(room: Room): Promise<void> {
    const roomKey = this.roomKey(room.id);

    await this.redisClient
      .multi()
      .hSet(roomKey, 'id', room.id)
      .hSet(roomKey, 'createdAt', room.createdAt.toISOString())
      .hSet(roomKey, 'isActive', ROOM_STATUS.ACTIVE)
      .hSet(roomKey, 'currentUsers', '0')
      .hSet(roomKey, 'maxCapacity', process.env.MAX_CAPACITY || '100')
      .exec();
    return;
  }

  async leaveRoom(userId: string, roomId: string): Promise<void> {
    const roomKey = this.roomKey(roomId);
    const roomUsersKey = this.roomUsersKey(roomId);

    const exists = await this.redisClient.exists(roomKey);
    if (!exists) {
      throw new RoomNotFoundException();
    }

    const isMember = await this.redisClient.sIsMember(roomUsersKey, userId);
    if (!isMember) {
      throw new UserNotInRoomException(roomId, userId);
    }

    const multi = this.redisClient.multi();
    multi.sRem(roomUsersKey, userId);
    multi.hIncrBy(roomKey, 'currentUsers', -1);

    await multi.exec();
  }

  async findRoom(roomId: string): Promise<Room> {
    const roomKey = this.roomKey(roomId);

    const exists = await this.redisClient.exists(roomKey);
    if (!exists) {
      return null;
    }

    const [id, createdAt] = await Promise.all([
      this.redisClient.hGet(roomKey, 'id'),
      this.redisClient.hGet(roomKey, 'createdAt'),
    ]);

    return new Room({
      id,
      createdAt: new Date(createdAt),
    });
  }

  async validateRoom(roomKey: string): Promise<void> {
    const exists = await this.redisClient.exists(roomKey);
    if (!exists) throw new RoomNotFoundException();

    const [isActive, currentUsers, maxCapacity] = await Promise.all([
      this.redisClient.hGet(roomKey, 'isActive'),
      this.redisClient.hGet(roomKey, 'currentUsers'),
      this.redisClient.hGet(roomKey, 'maxCapacity'),
    ]);

    if (!isActive || isActive === ROOM_STATUS.INACTIVE) {
      throw new RoomInactiveException(roomKey);
    }
    if (Number(currentUsers) >= Number(maxCapacity)) {
      throw new RoomIsFullException(roomKey, parseInt(maxCapacity));
    }
  }

  async joinRoom(userId: string, roomId: string): Promise<void> {
    const roomKey = this.roomKey(roomId);
    await this.validateRoom(roomKey);

    const multi = this.redisClient.multi();
    multi.sAdd(this.roomUsersKey(roomId), userId);
    multi.hIncrBy(roomKey, 'currentUsers', 1);

    await multi.exec();
  }

  async getCurrentUsers(roomId: string): Promise<number> {
    const roomKey = this.roomKey(roomId);
    const currentUsers = await this.redisClient.hGet(roomKey, 'currentUsers');
    return parseInt(currentUsers || '0', 10);
  }

  async findAllRoomVotes(roomId: string) {
    const key = this.roomVoteKey(roomId);

    return this.redisClient.hGetAll(key);
  }

  async findSongDuration(roomId: string) {
    const key = this.roomSessionKey(roomId);

    return this.redisClient.hGet(key, 'songs');
  }
}
