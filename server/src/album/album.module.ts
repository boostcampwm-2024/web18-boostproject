import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Album])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AlbumModule {}
