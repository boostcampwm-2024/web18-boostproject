import {
  Body,
  Controller,
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
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { AlbumRepository } from '@/album/album.repository';
import { RoomService } from '@/room/room.service';

export interface UploadedFiles {
  albumCover?: Express.Multer.File;
  bannerCover?: Express.Multer.File;
  songs: Express.Multer.File[];
}

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly musicProcessingService: MusicProcessingSevice,
    @InjectRepository(Album)
    private readonly albumRepository: AlbumRepository,
    private readonly roomService: RoomService,
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

    // 앨범 이미지 업로드 및 DB 저장
    await this.adminService.saveAlbumCoverAndBanner(files, album.id);

    //3. 노래 파일들 처리: 기존 processSongFiles 사용
    const processedSongs = await this.processSongFiles(
      files.songs,
      albumData,
      album.id,
    );

    await this.adminService.initializeStreamingSession(processedSongs, album);
    await this.adminService.saveSongs(processedSongs, album.id);
    await this.roomService.initializeRoom(album.id);

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
