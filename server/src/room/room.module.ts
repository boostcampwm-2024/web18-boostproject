import { Module } from '@nestjs/common';
import { RoomRepository } from './room.repository';
import { RedisModule } from '@/common/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [RoomRepository],
  exports: [RoomRepository],
})
export class RoomModule {}
