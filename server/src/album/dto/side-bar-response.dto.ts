import { ApiProperty } from '@nestjs/swagger';
import { GetSideBarInfosTuple } from '../album.repository';

export class SideBarResponseDto {
  @ApiProperty({ type: () => SideBarResponse, isArray: true })
  result: {
    streamingAlbums: SideBarResponse[];
    upComingAlbums: SideBarResponse[];
  };

  constructor(
    streamingAlbums: SideBarResponse[],
    upComingAlbums: SideBarResponse[],
  ) {
    this.result = {
      streamingAlbums,
      upComingAlbums,
    };
  }
}

export class SideBarResponse {
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
  static from(album: GetSideBarInfosTuple) {
    return new SideBarResponse(album.albumId, album.albumName, album.albumTags);
  }
}
