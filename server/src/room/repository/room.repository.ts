import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

export interface RoomInfo {
  currentUsers: number;
  maxCapacity: number;
  isActive: boolean;
  currentSong: string;
  songs: string[];
}

@Injectable()
export class RoomRepository {
  constructor(private readonly redisClient: RedisClientType) {}

  private roomKey(roomId: string): string {
    return `rooms:${roomId}`;
  }

  private roomUsersKey(roomId: string): string {
    return `rooms:${roomId}:users`;
  }

  private roomQueueKey(roomId: string): string {
    return `rooms:${roomId}:queue`;
  }

  async createRoom(roomId: string, room: RoomInfo): Promise<void> {
    await this.redisClient.hSet(this.roomKey(roomId), {
      isActive: String(room.isActive),
      currentUsers: room.currentUsers,
      maxCapacity: room.maxCapacity,
      songs: JSON.stringify(room.songs),
    });
  }

  async validateRoom(roomKey: string): Promise<void> {
    const exists = await this.redisClient.exists(roomKey);
    if (!exists) throw new Error('Room not found');

    const [isActive, currentUsers, maxCapacity] = await Promise.all([
      this.redisClient.hGet(roomKey, 'isActive'),
      this.redisClient.hGet(roomKey, 'currentUsers'),
      this.redisClient.hGet(roomKey, 'maxCapacity'),
    ]);

    if (!isActive || isActive !== 'true') {
      throw new Error('Room is inactive');
    }
    if (Number(currentUsers) >= Number(maxCapacity)) {
      throw new Error('Room is full');
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
}
