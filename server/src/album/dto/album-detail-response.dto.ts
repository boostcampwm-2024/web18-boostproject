import { ApiProperty } from '@nestjs/swagger';

export class AlbumDetailResponseDto {
  result: {
    albumDetails: AlbumDetailResponse;
    songDetails: AlbumDetailSongResponse[];
  };
  constructor(
    albumDetails: AlbumDetailResponse,
    songDetails: AlbumDetailSongResponse[],
  ) {
    this.result = {
      albumDetails,
      songDetails,
    };
  }
}

export class AlbumDetailResponse {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  artist: string;
  @ApiProperty()
  jacketUrl: string;
}

export class AlbumDetailSongResponse {
  @ApiProperty()
  songName: string;
  @ApiProperty()
  songDuration: number;
}
