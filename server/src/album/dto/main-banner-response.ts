import { ApiProperty } from '@nestjs/swagger';
import { GetAlbumBannerInfosTuple } from '../album.repository';

export class MainBannerResponseDto {
  @ApiProperty({ type: () => MainBannerResponse, isArray: true })
  result: {
    bannerLists: MainBannerResponse[];
  };

  constructor(bannerLists: MainBannerResponse[]) {
    this.result = {
      bannerLists,
    };
  }
}

export class MainBannerResponse {
  @ApiProperty()
  albumId: string;
  @ApiProperty()
  bannerImageUrl: string;
  @ApiProperty()
  currentUserCount: number;

  constructor(
    albumId: string,
    bannerImageUrl: string,
    currentUserCount: number,
  ) {
    this.albumId = albumId;
    this.bannerImageUrl = bannerImageUrl;
    this.currentUserCount = currentUserCount;
  }
  static from(album: GetAlbumBannerInfosTuple, currentUserCount: number) {
    return new MainBannerResponse(
      album.albumId,
      album.bannerImageUrl,
      currentUserCount,
    );
  }
}
