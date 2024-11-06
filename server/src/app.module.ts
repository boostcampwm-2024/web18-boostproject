import { Logger, Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { REDIS_CLIENT, RedisModule } from '@/common/redis/redis.module';
import { RoomRepository } from './room/room.repository';
import { RedisClientType } from 'redis';

@Module({
  imports: [CommonModule, ConfigModule.forRoot(), RedisModule],
  controllers: [AppController],
  providers: [Logger, AppService, RoomRepository],
})
export class AppModule {}
