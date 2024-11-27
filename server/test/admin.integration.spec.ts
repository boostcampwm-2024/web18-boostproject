import { Album } from '@/album/album.entity';
import { Song } from '@/song/song.entity';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AdminModule } from '../src/admin/admin.module';
import { AdminService } from '../src/admin/admin.service';
import { AlbumRepository } from '@/album/album.repository';
import { SongRepository } from '@/song/song.repository';
import { testTypeOrmConfig } from './config/typeorm.config';
import supertest from 'supertest';
import { createMockFiles, createTestAlbumData } from './mock/album.mock';
import { AdminGuard } from '@/admin/admin.guard';
import { MusicProcessingSevice } from '@/music/music.processor';
import { RoomService } from '@/room/room.service';

describe('AdminController Integration test', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let adminService: AdminService;
  let albumRepository: AlbumRepository;
  let songRepository: SongRepository;
  let musicProcessingService: MusicProcessingSevice;
  let roomService: RoomService;

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
    musicProcessingService = moduleRef.get<MusicProcessingSevice>(
      MusicProcessingSevice,
    );
    roomService = moduleRef.get<RoomService>(RoomService);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });

  describe('Admin Integration test', () => {
    describe('POST /admin/album:', () => {
      it('Should process complete album creation flow and save album and song info to DB', async () => {
        const albumData = createTestAlbumData();
        const mockFiles = createMockFiles();

        jest.spyOn(adminService as any, 'uploadImageFiles').mockResolvedValue({
          albumCoverURL: 'mock-album-url',
          bannerCoverURL: 'mock-banner-url',
        });
        jest
          .spyOn(musicProcessingService, 'processUpload')
          .mockImplementation(async (file, tempDir, songMetadata) => {
            const randomDuration =
              Math.floor(Math.random() * (300 - 120 + 1)) + 120;
            return {
              ...songMetadata,
              duration: randomDuration,
            };
          });
        jest
          .spyOn(adminService, 'initializeStreamingSession')
          .mockResolvedValue();

        jest.spyOn(roomService, 'initializeRoom').mockResolvedValue();

        const response = await supertest(app.getHttpServer())
          .post('/admin/album')
          .field('albumData', JSON.stringify(albumData))
          .attach('albumCover', mockFiles.albumCover.buffer, 'album.jpg')
          .attach('bannerCover', mockFiles.bannerCover.buffer, 'banner.jpg')
          .attach('songs', mockFiles.songs[0].buffer, 'song1.mp3')
          .attach('songs', mockFiles.songs[1].buffer, 'song2.mp3');

        expect(response.status).toBe(201);

        const savedAlbum = await albumRepository.findById(
          response.body.albumId,
        );

        expect(savedAlbum).toBeDefined();
        expect(savedAlbum.title).toBe(albumData.title);
        expect(savedAlbum.artist).toBe(albumData.artist);
        expect(savedAlbum.totalDuration).toBe(albumData.totalDuration);
        expect(savedAlbum.tags).toEqual(albumData.tags);

        expect(savedAlbum.bannerUrl).toBe('mock-banner-url');
        expect(savedAlbum.jacketUrl).toBe('mock-album-url');

        const savedSongs = await songRepository.getAlbumTracksSorted(
          savedAlbum.id,
          'ASC',
        );
        expect(savedSongs).toHaveLength(mockFiles.songs.length);
        savedSongs.forEach((song, index) => {
          expect(song.albumId).toBe(savedAlbum.id);
          expect(song.trackNumber).toBe(index + 1);
          expect(song.duration).toBeGreaterThan(0);
          expect(song.title).toBe(`TEST SONG ${index + 1}`);
        });
      });
    });
  });
});
