import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class UserNotInRoomException extends BaseException {
  constructor(roomId: string, userId: string) {
    super('방에 사용자가 존재하지 않습니다.', HttpStatus.FORBIDDEN, {
      roomId,
      userId,
    });
  }
}
