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
    }).compile();

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

  describe('앨범 관리', () => {
    it('앨범 생성 및 저장', async () => {
      const albumDto = new AlbumDto();
      albumDto.title = '테스트 앨범';
      albumDto.artist = '테스트 아티스트';
      albumDto.tags = 'K-POP, J-POP';
      albumDto.releaseDate = new Date();
      albumDto.totalDuration = 0;
      albumDto.bannerUrl = '';
      albumDto.jacketUrl = '';

      const album = new Album(albumDto);
      const savedAlbum = await albumRepository.save(album);
      const foundAlbum = await albumRepository.findById(savedAlbum.id);

      expect(foundAlbum.title).toBe('테스트 앨범');
      expect(foundAlbum.artist).toBe('테스트 아티스트');
      expect(foundAlbum.tags).toBe('K-POP, J-POP');
    });
  });
});
