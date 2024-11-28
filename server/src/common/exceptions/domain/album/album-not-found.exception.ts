import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../base.exception';

export class AlbumNotFoundException extends BaseException {
  constructor(albumId: string) {
    super('앨범을 찾을 수 없습니다.', HttpStatus.NOT_FOUND, { albumId });
  }
}
