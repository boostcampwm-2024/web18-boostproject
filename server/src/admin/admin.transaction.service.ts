import { Album } from '@/album/album.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RoomService } from '@/room/room.service';
import { AlbumRepository } from '@/album/album.repository';
import { AdminService } from './admin.service';
import { UploadedFiles } from './admin.controller';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class AdminTransactionService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly roomService: RoomService,
    private readonly albumRepository: AlbumRepository,
    private readonly adminService: AdminService,
  ) {}

  async saveInitialAlbum(albumData: Album): Promise<Album> {
    return await this.dataSource.transaction(async () => {
      return await this.albumRepository.save(albumData);
    });
  }

  async saveRemainingData(
    album: Album,
    processedSongs: any[],
    files: UploadedFiles,
  ): Promise<void> {
    await this.dataSource.transaction(async () => {
      // 1. 앨범 이미지 업로드 및 DB 저장

      await this.adminService.saveAlbumCoverAndBanner(files, album.id);

      // 2. Streaming Session 초기화
      await this.adminService.initializeStreamingSession(processedSongs, album);

      // 3. Songs 저장
      await this.adminService.saveSongs(processedSongs, album.id);

      // 4. Room 저장
      await this.roomService.initializeRoom(album.id);
    });
  }

  async deleteCreatedAlbum(albumId: string) {
    await this.albumRepository.delete(albumId);
  }
}
