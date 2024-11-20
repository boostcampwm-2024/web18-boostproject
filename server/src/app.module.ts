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

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot(),
    RedisModule,
    MusicModule,
    AdminModule,
    EmojiModule,
  ],
  controllers: [AppController, RoomController],
  providers: [Logger, AppService, RoomRepository, RoomGateway],
})
export class AppModule {}
