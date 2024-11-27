import { Injectable } from '@nestjs/common';
import { MusicRepository } from '@/music/music.repository';
import { Room } from '@/room/room.entity';
import { RoomRepository } from '@/room/room.repository';
import { AlreadyVoteThisRoomException } from '@/common/exceptions/domain/vote/already-vote-this-room.exception';

@Injectable()
export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly musicRepository: MusicRepository,
  ) {}

  async getTrackOrder(roomId: string): Promise<string> {
    return await this.musicRepository
      .findSongByJoinTimestamp(roomId, Date.now())
      .then((data) => data.id);
  }

  async initializeRoom(albumId: string) {
    await this.roomRepository.createRoom(
      new Room({ id: albumId, createdAt: new Date() }),
    );
  }

  async updateVote(roomId: string, trackNumber: string, identifier: string) {
    if (await this.roomRepository.existsRoomVoteUser(roomId, identifier)) {
      throw new AlreadyVoteThisRoomException(roomId);
    }

    await this.roomRepository.updateVoteByRoomAndIdentifier(
      roomId,
      trackNumber,
    );
    await this.roomRepository.saveVoteUser(roomId, identifier, trackNumber);
  }

  async getVoteResult(roomId: string) {
    const voteResult = await this.roomRepository.findAllRoomVotes(roomId);
    const songDurations = await this.roomRepository.findSongDuration(roomId);
    const songCount = JSON.parse(songDurations).length;
    for (let songIndex = 1; songIndex <= songCount; songIndex++) {
      voteResult[songIndex] = voteResult[songIndex] || '0';
    }

    return voteResult;
  }
}
