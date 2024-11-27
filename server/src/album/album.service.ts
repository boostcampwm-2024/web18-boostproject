import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { AlbumRedisRepository } from './album.redis.repository';
import {
  MainBannerResponse,
  MainBannerResponseDto,
} from './dto/main-banner-response.dto';
import { SideBarResponseDto } from './dto/side-bar-response.dto';
import { EndedAlbumResponseDto } from './dto/ended-album-response.dto';
import { AlbumDetailResponseDto } from './dto/album-detail-response.dto';

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

  async getEndedAlbums() {
    const date = new Date();
    const recentAlbums = await this.albumRepository.getEndedAlbumsInfos(date);

    return new EndedAlbumResponseDto(recentAlbums);
  }

  async getAlbumDetail(albumId: string): Promise<AlbumDetailResponseDto> {
    const albumDetail = await this.albumRepository.getAlbumDetailInfos(albumId);
    const albumSongDetail =
      await this.albumRepository.getAlbumDetailSongInfos(albumId);
    return new AlbumDetailResponseDto(albumDetail, albumSongDetail);
  }
}
