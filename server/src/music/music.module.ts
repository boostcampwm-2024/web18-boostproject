import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MusicProcessingSevice } from './music.processor';
import { CacheModule } from '@nestjs/cache-manager';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { MusicRepository } from './music.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register({
      ttl: 3600000,
      max: 1000,
      isGlobal: true,
    }),
  ],
  controllers: [MusicController],
  providers: [MusicProcessingSevice, MusicService, MusicRepository],
  exports: [MusicProcessingSevice],
})
export class MusicModule {}
