import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class RoomNotFoundException extends BaseException {
  constructor() {
    super('방이 존재하지 않습니다.', HttpStatus.NOT_FOUND);
  }
}
