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

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
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
  @UseInterceptors(FilesInterceptor('files'))
  async uploadSongs(
    @Param('albumId') albumId: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<any> {
    //Store the received file into separate temporary directories
    //Use music processor to parse mp3 to meu8 and upload to object storage
  }
}
