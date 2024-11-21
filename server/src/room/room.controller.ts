import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoomInfo, RoomRepository } from '@/room/room.repository';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RedisClientType } from 'redis';
import * as crypto from 'node:crypto';
import { RandomNameUtil } from '@/common/randomname/random-name.util';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { Repository } from 'typeorm';
import { Song } from '@/song/song.entity';
import { AlbumResponseDto } from '@/album/albumResponse.dto';
import { SongResponseDto } from '@/song/songResponse.dto';
import { plainToInstance } from 'class-transformer';
import { MusicRepository } from '@/music/music.repository';

@ApiTags('기본')
@Controller('room')
export class RoomController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    private readonly roomRepository: RoomRepository,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
    private readonly musicRepository: MusicRepository,
  ) {}

  @ApiOperation({ summary: '방 생성' })
  @ApiResponse({ status: 201, description: 'Room created successfully' })
  @Post()
  async createRoom(): Promise<any> {
    try {
      const roomId = 'TEMP_RANDOM_ROOM_ID';
      const roomInfo: RoomInfo = {
        currentUsers: 0,
        maxCapacity: 999,
        isActive: true,
        currentSong: '',
        songs: ['LOVE SONG', 'POWER'],
      };
      // await this.roomRepository.createRoom(roomId, roomInfo);
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
      const albumInfo = await this.albumRepository.findOne({
        where: { id: roomId },
      });
      const albumResponse = await this.getAlbumResponseDto(albumInfo);
      const songList = await this.songRepository.findBy({ albumId: roomId });
      const songResponseList = await Promise.all(
        songList.map(async (song) => await this.getSongResponseDto(song)),
      );

      const sortedSongList = songResponseList.sort(
        (a, b) => a.trackNumber - b.trackNumber,
      );

      const totalDuration = sortedSongList.reduce((acc, song) => {
        return acc + parseInt(song.duration);
      }, 0);

      const trackInfo = await this.musicRepository.findSongByJoinTimestamp(
        roomId,
        Date.now(),
      );

      return {
        success: true,
        ...roomInfo,
        albumResponse,
        sortedSongList,
        totalDuration,
        trackOrder: trackInfo.id,
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async getAlbumResponseDto(album: Album): Promise<AlbumResponseDto> {
    return plainToInstance(AlbumResponseDto, album, {
      excludeExtraneousValues: true,
    });
  }

  async getSongResponseDto(song: Song): Promise<SongResponseDto> {
    return plainToInstance(SongResponseDto, song, {
      excludeExtraneousValues: true,
    });
  }

  @ApiOperation({ summary: '방 참여' })
  @ApiResponse({ status: 201, description: 'Joined room successfully' })
  @Post('/join')
  async joinRoom(
    @Req() req: Request,
    @Body() joinRoomDto: { userId: string; roomId: string },
  ): Promise<object> {
    const identifier = crypto
      .createHmac('sha256', req.ip + process.env.SECRET_KEY)
      .digest('hex')
      .slice(0, 4);
    const randomName = RandomNameUtil.generate();
    try {
      await this.roomRepository.joinRoom(
        joinRoomDto.userId,
        joinRoomDto.roomId,
      );
      return { success: true, message: 'Joined room', identifier, randomName };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
}
