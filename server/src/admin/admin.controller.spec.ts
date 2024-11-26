import { Album } from '@/album/album.entity';
import { Song } from '@/song/song.entity';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AdminModule } from './admin.module';

describe('AdminController Integration test', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'Yooncer$00',
          database: 'inear_test',
          entities: [Album, Song],
          synchronize: true,
        }),
        AdminModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    dataSource = moduleRef.get<DataSource>(DataSource);

    await app.init();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true);
  });
});
