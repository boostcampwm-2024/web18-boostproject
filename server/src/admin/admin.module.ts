import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { MusicModule } from '@/music/music.module';
import { AdminService } from './admin.service';
import { AdminRedisRepository } from './admin.redis.repository';
import { RedisModule } from '@/common/redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '@/song/song.entity';
import { Album } from '@/album/album.entity';
import { RoomModule } from '@/room/room.module';
import { AlbumModule } from '@/album/album.module';
import { SongModule } from '@/song/song.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AlbumModule,
    RedisModule,
    MusicModule,
    RoomModule,
    SongModule,
    TypeOrmModule.forFeature([Album, Song]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'temporary-secret-key',
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRedisRepository],
  exports: [AdminService],
})
export class AdminModule {}
