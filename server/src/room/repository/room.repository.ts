import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

interface RoomInfo {
  currentUsers: number;
  maxCapacity: number;
  isActive: boolean;
  currentSong: string;
  songs: string[]; //URL of songs stored
}

@Injectable()
export class RoomRepository {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({
      port: Number(process.env.redisPort || 6379),
      host: process.env.redisEndpoint,
      username: process.env.redisUsername,
      password: process.env.redisPW,
    });
  }

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
    await this.redis.hset(this.roomKey(roomId), {
      isActive: String(room.isActive),
      currentUsers: room.currentUsers,
      maxCapacity: room.maxCapacity,
      songs: JSON.stringify(room.songs),
    });
  }

  async validateRoom(roomKey: string): Promise<void> {
    const exists = await this.redis.exists(roomKey);
    if (!exists) throw new Error('Room not found');

    const [isActive, currentUsers, maxCapacity] = await Promise.all([
      this.redis.hget(roomKey, 'isActive'),
      this.redis.hget(roomKey, 'currentUsers'),
      this.redis.hget(roomKey, 'maxCapacity'),
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

    const multi = this.redis.multi();
    multi.sadd(this.roomUsersKey(roomId), userId);
    multi.hincrby(roomKey, 'currentUsers', 1);

    await multi.exec();
  }
}
