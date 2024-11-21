import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '@/song/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [],
  providers: [],
  exports: [],
})
export class SongModule {}
