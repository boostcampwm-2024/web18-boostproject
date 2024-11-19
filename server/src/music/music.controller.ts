import {
  Controller,
  Get,
  Header,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Query,
  StreamableFile,
} from '@nestjs/common';
import { MusicService } from './music.service';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get(':musicId/playlist.m3u8')
  @Header('Content-Type', 'application/x-mpegURL')
  async getMusicFile(
    @Param('musicId') musicId: string,
    @Query('joinTimeStamp') joinTimeStamp: string,
  ) {
    if (!joinTimeStamp) {
      throw new HttpException(
        'joinTimeStamp is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.musicService.generateMusicFile(
      musicId,
      parseInt(joinTimeStamp, 10),
    );
  }

  @Get(':musicId/playlist:segmentId.ts')
  @Header('Content-Type', 'video/MP2T')
  async getSegment(
    @Param('musicId') musicId: string,
    @Param('segmentId') segmentId: string,
  ) {
    return new StreamableFile(
      await this.musicService.getSegment(musicId, segmentId),
      { type: 'video/MP2T' },
    );
  }
}
