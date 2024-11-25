import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class RoomInactiveException extends BaseException {
  constructor(roomKey: string) {
    super(
      '비활성화 상태인 방입니다.',
      HttpStatus.NOT_FOUND,
      'Room Is Inactive',
      { roomKey },
    );
  }
}
