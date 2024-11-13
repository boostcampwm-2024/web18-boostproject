import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@/common/redis/redis.module';
import { RoomRepository } from './room/room.repository';
import { RoomController } from '@/room/room.controller';
import { RoomGateway } from './room/room.gateway';
import { UserRepository } from '@/user/user.repository';

@Module({
  imports: [CommonModule, ConfigModule.forRoot(), RedisModule],
  controllers: [AppController, RoomController],
  providers: [Logger, AppService, RoomRepository, RoomGateway, UserRepository],
})
export class AppModule {}
