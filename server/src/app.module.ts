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

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot(),
    RedisModule,
    MusicModule,
    AdminModule,
    EmojiModule,
    AlbumModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Album],
    }),
  ],
  controllers: [AppController, RoomController],
  providers: [Logger, AppService, RoomRepository, RoomGateway],
})
export class AppModule {}
