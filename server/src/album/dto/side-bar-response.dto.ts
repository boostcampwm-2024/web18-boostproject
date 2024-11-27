import { ApiProperty } from '@nestjs/swagger';

export class SideBarResponseDto {
  @ApiProperty({ type: () => SideBarDto, isArray: true })
  result: {
    streamingAlbums: SideBarDto[];
    upComingAlbums: SideBarDto[];
  };

  constructor(streamingAlbums: SideBarDto[], upComingAlbums: SideBarDto[]) {
    this.result = {
      streamingAlbums,
      upComingAlbums,
    };
  }
}

export class SideBarDto {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  albumTags: string;

  constructor(albumId: string, albumName: string, albumTags: string) {
    this.albumId = albumId;
    this.albumName = albumName;
    this.albumTags = albumTags;
  }
  static from(album: SideBarDto) {
    return new SideBarDto(album.albumId, album.albumName, album.albumTags);
  }
}
