import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { AlbumRedisRepository } from './album.redis.repository';
import {
  MainBannerResponse,
  MainBannerResponseDto,
} from './dto/main-banner-response.dto';
import { SideBarResponseDto } from './dto/side-bar-response.dto';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly albumRedisRepository: AlbumRedisRepository,
  ) {}
  async getMainBannerInfos(): Promise<MainBannerResponseDto> {
    const date = new Date();
    const albumBannerInfos =
      await this.albumRepository.getAlbumBannerInfos(date);

    const banners = await Promise.all(
      albumBannerInfos.map(async (album) => {
        const currentUserCount =
          await this.albumRedisRepository.getCurrentUsers(album.albumId);
        return MainBannerResponse.from(album, currentUserCount);
      }),
    );
    return new MainBannerResponseDto(banners);
  }

  async getSideBarInfos() {
    const date = new Date();
    const recentSideBarAlbums =
      await this.albumRepository.getRecentSideBarInfos(date);

    const upComingAlbums =
      await this.albumRepository.getUpComingSideBarInfos(date);
    return new SideBarResponseDto(recentSideBarAlbums, upComingAlbums);
  }
}
