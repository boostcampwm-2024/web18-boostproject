import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomInfo, RoomRepository } from '@/room/room.repository';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RedisClientType } from 'redis';

@ApiTags('기본')
@Controller('room')
export class RoomController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly roomRepository: RoomRepository,
  ) {}

  @ApiOperation({ summary: '방 생성' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @Post()
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

  @ApiOperation({ summary: '방 정보 확인' })
  @ApiParam({ name: 'roomId', required: true })
  @ApiResponse({ status: 200, description: 'Room info retrieved successfully' })
  @Get('/:roomId')
  async getRoomInfo(@Param('roomId') roomId: string): Promise<any> {
    const roomKey = `rooms:${roomId}`;
    try {
      const roomInfo = await this.redisClient.hGetAll(roomKey);
      return { success: true, roomInfo };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  @ApiOperation({ summary: '방 참여' })
  @ApiResponse({ status: 201, description: 'Joined room successfully' })
  @Post('/join')
  async joinRoom(
    @Body() joinRoomDto: { userId: string; roomId: string },
  ): Promise<object> {
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
