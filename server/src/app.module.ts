import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/common/redis/redis.module';
import { RoomRepository } from './room/room.repository';
import { RoomController } from '@/room/room.controller';
import { RoomGateway } from './room/room.gateway';
import { MusicProcessingSevice } from './music/music.processor';
import { MusicModule } from './music/music.module';

@Module({
  imports: [CommonModule, ConfigModule.forRoot(), RedisModule, MusicModule],
  controllers: [AppController, RoomController],
  providers: [Logger, AppService, RoomRepository, RoomGateway],
})
export class AppModule {}
