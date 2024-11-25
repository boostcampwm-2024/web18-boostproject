import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '@/song/song.entity';
import { SongRepository } from '@/song/song.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [],
  providers: [SongRepository],
  exports: [SongRepository],
})
export class SongModule {}
