import { ApiProperty } from '@nestjs/swagger';

export class AlbumDetailResponseDto {
  result: {
    albumDetails: AlbumDetailDto;
    songDetails: AlbumDetailSongDto[];
  };
  constructor(
    albumDetails: AlbumDetailDto,
    songDetails: AlbumDetailSongDto[],
  ) {
    this.result = {
      albumDetails,
      songDetails,
    };
  }
}

export class AlbumDetailDto {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  artist: string;
  @ApiProperty()
  jacketUrl: string;
}

export class AlbumDetailSongDto {
  @ApiProperty()
  songName: string;
  @ApiProperty()
  songDuration: number;
}
