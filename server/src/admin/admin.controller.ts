import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AlbumDto } from './dto/AlbumDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import path from 'path';
import * as fs from 'fs/promises';
import { MusicProcessingSevice } from '@/music/music.processor';
import { AdminService } from './admin.service';
import { AdminRedisRepository } from './admin.redis.repository';

export interface UploadedFiles {
  albumCover?: Express.Multer.File;
  bannerCover?: Express.Multer.File;
  songs: Express.Multer.File[];
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminRedisRepository: AdminRedisRepository,
    private readonly adminService: AdminService,
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
    // TODO 성준님 1. MySQL DB에 앨범 정보 저장 하고 앨범 Id를 반환 받음
    //const albumId = this.adminRepository.createAlbum();

    // 앨범 임시 ID
    const albumId = 'RANDOM_AHH_ALBUM_ID';
    const imageUrls: {
      albumCoverURL?: string;
      bannerCoverURL?: string;
    } = {};

    //2. 앨범 커버 이미지, 배너 이미지를 S3에 업로드 하고 URL을 반환 받음
    if (files.albumCover?.[0] || files.bannerCover?.[0]) {
      const uploadResults = await this.adminService.uploadImageFiles(
        files.albumCover?.[0],
        files.bannerCover?.[0],
        `converted/${albumId}`,
      );

      Object.assign(imageUrls, uploadResults);
    }

    // await this.adminRepository.updateAlbumUrls(albumId, {
    //   albumCoverURL,
    //   bannerCoverURL
    // });

    //3. 노래 파일들 처리: 기존 processSongFiles 사용
    const processedSongs = await this.processSongFiles(
      files.songs,
      albumData,
      albumId,
    );

    const songDurations = processedSongs.map((song) => song.duration);
    const releaseTimestamp = new Date(albumData.releaseDate).getTime();

    await this.adminRedisRepository.createStreamingSession(
      albumId,
      releaseTimestamp,
      songDurations,
    );

    // TODO: MySQL에 processedSong에 들어가 있는 정보를 기반으로 DB에 노래 정보 저장
    //return { albumId };

    return {
      albumId,
      message: 'Album songs updated to object storage successfully',
    };
  }

  private async processSongFiles(
    songFiles: Express.Multer.File[],
    albumData: AlbumDto,
    albumId: string,
  ): Promise<any> {
    const tempDir = await this.createTempDirectory(albumId);

    //Processed song 안에서 노래에 관한 모든 정보를 JSON 형태로 받을 수 있음
    //TODO: processedSongs를 기반으로 MySQL에 정보 저장
    const processedSongs = await Promise.all(
      songFiles.map(async (file, index) => {
        const songInfo = albumData.songs[index];
        return await this.musicProcessingService.processUpload(file, tempDir, {
          albumId,
          ...songInfo,
        });
      }),
    );

    await fs.rm(tempDir, { recursive: true, force: true });

    return processedSongs;
  }

  private async createTempDirectory(albumId: string): Promise<string> {
    const tempDir = path.join(__dirname, `album/${albumId}`);
    await fs.mkdir(tempDir, { recursive: true });
    return tempDir;
  }
}
