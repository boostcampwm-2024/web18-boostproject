import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class UserRoomInfoNotFoundException extends BaseException {
  constructor(socketId: string) {
    super('사용자의 방 정보가 존재하지 않습니다.', HttpStatus.BAD_REQUEST, {
      socketId,
    });
  }
}
