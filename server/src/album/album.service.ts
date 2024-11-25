import { Injectable } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { AlbumRedisRepository } from './album.redis.repository';
import {
  MainBannerResponse,
  MainBannerResponseDto,
} from './dto/main-banner-response';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly albumRedisRepository: AlbumRedisRepository,
  ) {}
  async getMainBannerInfos() {
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
}
