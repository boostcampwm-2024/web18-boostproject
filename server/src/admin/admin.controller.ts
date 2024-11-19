import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { REDIS_CLIENT } from '@/common/redis/redis.module';
import { RedisClientType } from 'redis';
import { AlbumDto } from './dto/AlbumDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs/promises';
import { MusicProcessingSevice } from '@/music/music.processor';

export interface UploadedFiles {
  albumCover: Express.Multer.File;
  bannerCover: Express.Multer.File;
  songs: Express.Multer.File[];
}

@Controller('admin')
export class AdminController {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClientType,
    @Inject() private readonly musicProcessingService: MusicProcessingSevice,
  ) {}

  @Post('album')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'albumCover' },
      { name: 'bannerCover' },
      { name: 'songs' },
    ]),
  )
  async createAlbum(
    @UploadedFiles() files: UploadedFiles,
    @Body('albumData') albumDataString: string,
  ): Promise<any> {
    const albumData = JSON.parse(albumDataString) as AlbumDto;
    // 1. MySQL DB에 앨범 정보 저장 하고 앨범 Id를 반환 받음
    //const albumId = this.adminRepository.createAlbum();
    const albumId = 'RANDOM_AHH_ALBUM_ID';

    // 2. 앨범 커버 이미지, 배너 이미지를 S3에 업로드 하고 URL을 반환 받음
    // const [albumCoverURL, bannerCoverURL] = this.adminService.uploadImage(
    //   files.albumCover,
    //   files.bannerCover,
    //   albumId,
    // );

    // await this.adminRepository.updateAlbumUrls(albumId, {
    //   albumCoverURL,
    //   bannerCoverURL
    // });

    // 3. 노래 파일들 처리: 기존 processSongFiles 사용
    const message = await this.processSongFiles(
      files.songs,
      albumData,
      albumId,
    );
    return message;

    // 4. MySQL DB에 노래 정보 저장
  }

  private async processSongFiles(
    songFiles: Express.Multer.File[],
    albumData: AlbumDto,
    albumId: string,
  ): Promise<any> {
    //Store the received file into separate temporary directories
    const tempDir = await this.createTempDirectory(albumId);

    //Use music processor to parse mp3 to meu8 and upload to object storage
    await Promise.all(
      songFiles.map(async (file, index) => {
        const songInfo = albumData.songs[index];
        await this.musicProcessingService.processUpload(file, tempDir, {
          albumId,
          ...songInfo,
        });
      }),
    );

    // 임시 디렉토리 제거
    await fs.rm(tempDir, { recursive: true, force: true });

    return {
      albumId,
      message: 'Album songs updated to object storage successfully',
    };
  }

  private async createTempDirectory(albumId: string): Promise<string> {
    const tempDir = path.join(__dirname, `album/${albumId}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }
}
