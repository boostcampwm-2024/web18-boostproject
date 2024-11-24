import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Album } from './album.entity';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class AlbumRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getAlbumBannerInfos(
    currentTime: string,
  ): Promise<GetAlbumBannerInfosTuple[]> {
    const albumBannerInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select(['id as albumId', 'banner_url as bannerImageUrl'])
      .where('release_date > :currentTime', { currentTime })
      .getRawMany();

    return plainToInstance(GetAlbumBannerInfosTuple, albumBannerInfos);
  }
}

export class GetAlbumBannerInfosTuple {
  albumId: string;
  bannerImageUrl: string;
}
