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

  @Get(':albumId/playlist.m3u8')
  @Header('Content-Type', 'application/x-mpegURL')
  async getMusicFile(@Param('albumId') albumId: string) {
    return await this.musicService.generateMusicFile(albumId);
  }

  @Get(':albumId/:songIndex/playlist:segmentId.ts')
  @Header('Content-Type', 'video/MP2T')
  async getSegment(
    @Param('albumId') albumId: string,
    @Param('songIndex') songIndex: string,
    @Param('segmentId') segmentId: string,
  ) {
    return new StreamableFile(
      await this.musicService.getSegment(albumId, songIndex, segmentId),
      { type: 'video/MP2T' },
    );
  }
}
