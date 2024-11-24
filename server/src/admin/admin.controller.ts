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
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { RoomRepository } from '@/room/room.repository';
import { Room } from '@/room/room.entity';
import { AlbumRepository } from '@/album/album.repository';

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
    @InjectRepository(Album)
    private readonly albumRepository: AlbumRepository,
    private readonly roomRepository: RoomRepository,
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
    const album = await this.albumRepository.save(new Album(albumData));

    // 앨범 임시 ID
    const imageUrls: {
      albumCoverURL?: string;
      bannerCoverURL?: string;
    } = await this.adminService.uploadImageFiles(
      files.albumCover?.[0],
      files.bannerCover?.[0],
      `converted/${album.id}`,
    );

    await this.albumRepository.updateAlbumUrls(album.id, imageUrls);
    // TODO: albumData.setBannerUrl(albumCoverUrl), albumData.setJacketUrl(bannerCoverUrl);

    //3. 노래 파일들 처리: 기존 processSongFiles 사용
    const processedSongs = await this.processSongFiles(
      files.songs,
      albumData,
      album.id,
    );

    const songDurations = processedSongs.map((song) => song.duration);
    const releaseTimestamp = new Date(albumData.releaseDate).getTime();

    await this.adminRedisRepository.createStreamingSession(
      album.id,
      releaseTimestamp,
      songDurations,
    );

    await this.adminService.saveSongs(processedSongs, album.id);

    await this.roomRepository.createRoom(
      new Room({ id: album.getId(), createdAt: new Date() }),
    );

    return {
      albumId: album.id,
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
