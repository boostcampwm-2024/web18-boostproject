import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class SongFileNotFoundException extends BaseException {
  constructor() {
    super(
      '음악 파일이 필요합니다.',
      HttpStatus.BAD_REQUEST,
      'Music File Required',
    );
  }
}
