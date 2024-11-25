import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class RoomIsFullException extends BaseException {
  constructor(roomKey: string, maxCapacity: number) {
    super('방의 인원이 가득찼습니다.', HttpStatus.SERVICE_UNAVAILABLE, {
      roomKey,
      maxCapacity,
    });
  }
}
