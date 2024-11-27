import { ApiProperty } from '@nestjs/swagger';

export class EndedAlbumResponseDto {
  @ApiProperty({ type: () => EndedAlbumResponse, isArray: true })
  result: {
    endedAlbums: EndedAlbumResponse[];
  };

  constructor(endedAlbums: EndedAlbumResponse[]) {
    this.result = {
      endedAlbums,
    };
  }
}

export class EndedAlbumResponse {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  artist: string;
  @ApiProperty()
  albumTags: string;
}
