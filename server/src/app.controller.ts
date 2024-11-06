import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  LoggerService,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RedisClientType } from 'redis';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RoomInfo, RoomRepository } from './room/repository/room.repository';

@ApiTags('기본')
@Controller()
export class AppController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly roomRepository: RoomRepository,
  ) {}

  @ApiOperation({ summary: '기본' })
  @Get('/redis')
  async testRedis(): Promise<any> {
    try {
      await this.redisClient.set('inear', '인이어임다');
      const value = await this.redisClient.get('inear');
      return { success: true, value };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @ApiOperation({ summary: '방 생성' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @Post('/room')
  async createRoom(): Promise<any> {
    try {
      const roomId = 'TEMP_RANDOM_ROOM_ID';
      const roomInfo: RoomInfo = {
        currentUsers: 0,
        maxCapacity: 10,
        isActive: true,
        currentSong: '',
        songs: ['LOVE SONG', 'POWER'],
      };
      await this.roomRepository.createRoom(roomId, roomInfo);
      return { success: true, message: 'Room created' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @ApiOperation({ summary: '방 정보 조회' })
  @ApiParam({ name: 'roomId', required: true })
  @ApiResponse({ status: 200, description: 'Room info retrieved successfully' })
  @Get('/room/:roomId')
  async getRoomInfo(@Param('roomId') roomId: string): Promise<any> {
    try {
      const roomKey = `rooms:${roomId}`;
      const roomInfo = await this.redisClient.hGetAll(roomKey);
      const users = await this.redisClient.sMembers(`rooms:${roomId}:users`);
      return {
        success: true,
        roomInfo: {
          ...roomInfo,
          songs: JSON.parse(roomInfo.songs || '[]'),
          users,
        },
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @ApiOperation({ summary: '방 참여' })
  @ApiResponse({ status: 201, description: 'Joined room successfully' })
  @Post('/room/join')
  async joinRoom(
    @Body() joinRoomDto: { userId: string; roomId: string },
  ): Promise<any> {
    try {
      await this.roomRepository.joinRoom(
        joinRoomDto.userId,
        joinRoomDto.roomId,
      );
      return { success: true, message: 'Joined room' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
