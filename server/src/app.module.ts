import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/common/redis/redis.module';
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
import { SchedulerService } from './common/scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { Comment } from './comment/comment.entity';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [
    CommonModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    RedisModule,
    MusicModule,
    AdminModule,
    EmojiModule,
    AlbumModule,
    SongModule,
    RoomModule,
    CommentModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Album, Song, Comment],
    }),
  ],
  controllers: [AppController],
  providers: [Logger, MusicRepository, SchedulerService],
})
export class AppModule {}
