import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { AlbumRepository } from '@/album/album.repository';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRedisRepository } from './album.redis.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [AlbumController],
  providers: [AlbumService, AlbumRepository, AlbumRedisRepository],
  exports: [AlbumRepository],
})
export class AlbumModule {}
