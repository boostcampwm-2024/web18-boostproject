import { Module } from '@nestjs/common';
import { RoomRepository } from '@/room/room.repository';
import { RoomGateway } from '@/room/room.gateway';
import { RoomController } from '@/room/room.controller';
import { Room } from '@/room/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumModule } from '@/album/album.module';
import { SongModule } from '@/song/song.module';
import { MusicModule } from '@/music/music.module';
import { RoomService } from '@/room/room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room]),
    AlbumModule,
    SongModule,
    MusicModule,
  ],
  controllers: [RoomController],
  providers: [RoomRepository, RoomGateway, RoomService],
  exports: [TypeOrmModule, RoomService],
})
export class RoomModule {}
