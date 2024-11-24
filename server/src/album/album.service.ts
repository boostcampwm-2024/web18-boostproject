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
    const utcDate = new Date();
    // KTC로 변환 후, 포맷팅
    const formattedTime = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    const albumBannerInfos =
      await this.albumRepository.getAlbumBannerInfos(formattedTime);

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
