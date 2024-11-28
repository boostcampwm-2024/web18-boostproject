import { Injectable } from '@nestjs/common';
import { MusicRepository } from '@/music/music.repository';
import { Room } from '@/room/room.entity';
import { RoomRepository } from '@/room/room.repository';
import crypto from 'crypto';

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
    const alreadyVotedNumber = await this.getRoomVoteUser(roomId, identifier);

    if (alreadyVotedNumber) {
      await this.roomRepository.updateVoteByRoomAndIdentifier(
        roomId,
        alreadyVotedNumber,
        -1,
      );
    }

    await this.roomRepository.updateVoteByRoomAndIdentifier(
      roomId,
      trackNumber,
      1,
    );

    await this.roomRepository.saveVoteUser(roomId, identifier, trackNumber);
  }

  async getRoomVoteUser(roomId: string, identifier: string) {
    return this.roomRepository.getRoomVoteUser(roomId, identifier);
  }

  generateIdentifier(address: string) {
    return crypto.createHash('sha256').update(address).digest('hex');
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

  calcPercentage(value: string, total: number) {
    return value === '0' || total === 0
      ? '0%'
      : `${((Number(value) / total) * 100).toFixed(0)}%`;
  }
}
