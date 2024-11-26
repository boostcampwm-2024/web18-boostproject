import { Album } from '@/album/album.entity';
import { Song } from '@/song/song.entity';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AdminModule } from '../src/admin/admin.module';
import { AdminService } from '../src/admin/admin.service';
import { AdminController, UploadedFiles } from '../src/admin/admin.controller';
import { AlbumRepository } from '@/album/album.repository';
import { SongRepository } from '@/song/song.repository';
import { AlbumDto } from '../src/admin/dto/album.dto';
import { testTypeOrmConfig } from './config/typeorm.config';
import supertest from 'supertest';
import { SongDto } from '@/admin/dto/song.dto';
import { createMockFiles, createTestAlbumData } from './mock/album.mock';
import { AdminGuard } from '@/admin/admin.guard';
import { SongSaveDto } from '@/song/dto/song-save.dto';

describe('AdminController Integration test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminService: AdminService;
  let adminController: AdminController;
  let albumRepository: AlbumRepository;
  let songRepository: SongRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TypeOrmModule.forRootAsync(testTypeOrmConfig), AdminModule],
    })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleRef.createNestApplication();
    dataSource = moduleRef.get<DataSource>(DataSource);
    adminService = moduleRef.get<AdminService>(AdminService);
    albumRepository = moduleRef.get<AlbumRepository>(AlbumRepository);
    songRepository = moduleRef.get<SongRepository>(SongRepository);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  describe('Admin Integration (e2e) test', () => {
    it('POST /admin/album integration test', async () => {
      const albumData = createTestAlbumData();
      const mockFiles = createMockFiles();

      jest.spyOn(adminService as any, 'uploadImageFiles').mockResolvedValue({
        albumCoverURL: 'mock-album-url',
        bannerCoverURL: 'mock-banner-url',
      });

      const response = await supertest(app.getHttpServer())
        .post('/admin/album')
        .field('albumData', JSON.stringify(albumData))
        .attach('albumCover', mockFiles.albumCover.buffer, 'album.jpg')
        .attach('bannerCover', mockFiles.bannerCover.buffer, 'banner.jpg')
        .attach('songs', mockFiles.songs[0].buffer, 'song1.mp3')
        .attach('songs', mockFiles.songs[1].buffer, 'song2.mp3');

      expect(response.status).toBe(201);

      const savedAlbum = await albumRepository.findById(response.body.albumId);

      expect(savedAlbum).toBeDefined();
      expect(savedAlbum.title).toBe(albumData.title);
      expect(savedAlbum.artist).toBe(albumData.artist);
      expect(savedAlbum.totalDuration).toBe(albumData.totalDuration);
      expect(savedAlbum.tags).toEqual(albumData.tags);

      expect(savedAlbum.bannerUrl).toBe('mock-banner-url');
      expect(savedAlbum.jacketUrl).toBe('mock-album-url');
    });
  });
});
