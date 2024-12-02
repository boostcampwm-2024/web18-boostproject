import { ApiProperty } from '@nestjs/swagger';

export class AlbumCommentResponseDto {
  @ApiProperty({ type: () => AlbumCommentDto, isArray: true })
  result: {
    albumComments: AlbumCommentDto[];
  };

  constructor(albumComments: AlbumCommentDto[]) {
    this.result = {
      albumComments,
    };
  }
}

export class AlbumCommentDto {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  createdAt: Date;
}
