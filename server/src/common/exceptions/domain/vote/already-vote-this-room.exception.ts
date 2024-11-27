import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AlreadyVoteThisRoomException extends BaseException {
  constructor(roomId: string) {
    super('이미 투표한 방입니다.', HttpStatus.BAD_REQUEST, { roomId });
  }
}
