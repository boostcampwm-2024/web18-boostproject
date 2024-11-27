import { ApiProperty } from '@nestjs/swagger';

export class EndedAlbumResponseDto {
  @ApiProperty({ type: () => EndedAlbumDto, isArray: true })
  result: {
    endedAlbums: EndedAlbumDto[];
  };

  constructor(endedAlbums: EndedAlbumDto[]) {
    this.result = {
      endedAlbums,
    };
  }
}

export class EndedAlbumDto {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  artist: string;
  @ApiProperty()
  albumTags: string;
  @ApiProperty()
  jacketUrl: string;
}
