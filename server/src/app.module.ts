import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/common/redis/redis.module';
import { RoomRepository } from './room/room.repository';
import { RoomController } from '@/room/room.controller';
import { RoomGateway } from './room/room.gateway';
import { MusicModule } from './music/music.module';
import { EmojiModule } from './emoji/emoji.module';
import { AdminModule } from './admin/admin.module';
import { AlbumModule } from '@/album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { Song } from '@/song/song.entity';
import { SongModule } from '@/song/song.module';
import { MusicRepository } from '@/music/music.repository';
import { RoomModule } from '@/room/room.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    MusicModule,
    AdminModule,
    EmojiModule,
    AlbumModule,
    SongModule,
    RoomModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Album, Song],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [Logger, AppService, MusicRepository],
})
export class AppModule {}
