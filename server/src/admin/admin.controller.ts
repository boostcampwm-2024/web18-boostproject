import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RedisClientType } from 'redis';
import { AlbumDto } from './dto/AlbumDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs/promises';
import { MusicProcessingSevice } from '@/music/music.processor';

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    @Inject() private readonly musicProcessingService: MusicProcessingSevice,
  ) {}

  @Post('albums')
  async createAlbum(@Body() albumDto: AlbumDto): Promise<any> {
    //return this.albumService.create(albumDto);
    //원래는 DB에 저장을 진행해야하지만 일단 테스트를 위해서 정보를 저장 레디스에 때려박음
    const albumId = crypto.randomUUID();
    await this.redisClient.hSet(`album:${albumId}`, {
      title: albumDto.title,
      artist: albumDto.artist,
      releaseDate: albumDto.releaseDate,
      songs: JSON.stringify(albumDto.songs),
    });
    return { albumId, message: 'Album information stored successfully' };
  }

  @Post('albums/:albumId/songs')
  @UseInterceptors(FilesInterceptor('files')) //files 이라는 필드 이름으로 전송
  async uploadSongs(
    @Param('albumId') albumId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    // 앨범 정보와 수록곡 정보를 Redis에서 조회
    const albumInfo = await this.redisClient.hGetAll(`album:${albumId}`);
    if (!albumInfo) {
      //Error 처리: try-catch 문?
      throw new Error('Album not found');
    }
    //노래에 관한 정보를 받아옴
    const songs = JSON.parse(albumInfo.songs);

    //Store the received file into separate temporary directories
    const tempDir = await this.createTempDirectory(albumId);

    //Use music processor to parse mp3 to meu8 and upload to object storage

    for (const [index, file] of files.entries()) {
      const songInfo = songs[index];
      // await this.musicProcessingService.processUpload(file, tempDir, {
      //   albumId,
      //   ...songInfo,
      // });
      console.log(file);
      console.log(songInfo);
    }

    // 임시 디렉토리 제거
    await fs.rm(tempDir, { recursive: true, force: true });
  }

  private async createTempDirectory(albumId: string): Promise<string> {
    const tempDir = path.join(__dirname, `album/${albumId}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }
}
