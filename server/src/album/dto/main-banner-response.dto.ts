import { ApiProperty } from '@nestjs/swagger';
import { GetAlbumBannerInfosTuple } from '../album.repository';

export class MainBannerResponseDto {
  @ApiProperty({ type: () => MainBannerDto, isArray: true })
  result: {
    bannerLists: MainBannerDto[];
  };

  constructor(bannerLists: MainBannerDto[]) {
    this.result = {
      bannerLists,
    };
  }
}

export class MainBannerDto {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  albumName: string;
  @ApiProperty()
  albumTags: string;
  @ApiProperty()
  artist: string;
  @ApiProperty()
  releaseDate: Date;
  @ApiProperty()
  bannerImageUrl: string;
  @ApiProperty()
  currentUserCount: number;

  constructor(
    albumId: string,
    albumName: string,
    albumTags: string,
    artist: string,
    releaseDate: Date,
    bannerImageUrl: string,
    currentUserCount: number,
  ) {
    this.albumId = albumId;
    this.albumName = albumName;
    this.albumTags = albumTags;
    this.artist = artist;
    this.releaseDate = releaseDate;
    this.bannerImageUrl = bannerImageUrl;
    this.currentUserCount = currentUserCount;
  }
  static from(album: GetAlbumBannerInfosTuple, currentUserCount: number) {
    return new MainBannerDto(
      album.albumId,
      album.albumName,
      album.albumTags,
      album.artist,
      album.releaseDate,
      album.bannerImageUrl,
      currentUserCount,
    );
  }
}
