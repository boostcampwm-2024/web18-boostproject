import { HttpStatus } from '@nestjs/common';
import { BaseException } from '../../base.exception';

export class AlbumNotFoundByTimestampException extends BaseException {
  constructor(albumId: string, timestamp: number) {
    super('주어진 시간에 맞는 앨범을 찾을 수 없습니다.', HttpStatus.NOT_FOUND, {
      albumId,
      timestamp,
    });
  }
}
