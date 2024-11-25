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

  async getTrackOrder(roomId: string): Promise<object> {
    return this.musicRepository.findSongByJoinTimestamp(roomId, Date.now());
  }

  async initializeRoom(albumId: string) {
    await this.roomRepository.createRoom(
      new Room({ id: albumId, createdAt: new Date() }),
    );
  }
}
