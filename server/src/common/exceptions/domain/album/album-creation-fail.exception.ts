import { BaseException } from '@/common/exceptions/base.exception';
import { HttpStatus } from '@nestjs/common';

export class AlbumCreationFailedException extends BaseException {
  constructor() {
    super(
      '앨범 생성 중 오류가 발생하였습니다.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
