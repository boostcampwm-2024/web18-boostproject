import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { AlbumRepository } from '@/album/album.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [],
  providers: [AlbumRepository],
  exports: [AlbumRepository],
})
export class AlbumModule {}
