import { Injectable } from '@nestjs/common';
import { MusicRepository } from '@/music/music.repository';
import { Room } from '@/room/room.entity';
import { RoomRepository } from '@/room/room.repository';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly musicRepository: MusicRepository,
  ) {}

  async getTrackOrder(roomId: string): Promise<string> {
    // return await this.musicRepository
    //   .findSongByJoinTimestamp(roomId, Date.now())
    //   .then((data) => data.id);
    return await this.musicRepository
      .findSongByJoinTimestamp(roomId, 1700000000000)
      .then((data) => data.id);
  }

  async initializeRoom(albumId: string) {
    await this.roomRepository.createRoom(
      // new Room({ id: albumId, createdAt: new Date() }),
      new Room({ id: albumId, createdAt: new Date(1700000000000) }),
    );
  }
}
