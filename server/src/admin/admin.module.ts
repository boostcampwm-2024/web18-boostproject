import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminController } from './admin.controller';
import { MusicModule } from '@/music/music.module';
import { AdminService } from './admin.service';
import { AdminRedisRepository } from './admin.redis.repository';
import { RedisModule } from '@/common/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    RedisModule,
    MusicModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminRedisRepository],
  exports: [AdminService],
})
export class AdminModule {}
