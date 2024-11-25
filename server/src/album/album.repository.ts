import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async updateAlbumUrls(
    albumId: string,
    urls: { albumCoverURL?: string; bannerCoverURL?: string },
  ): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Album)
      .set({ bannerUrl: urls.bannerCoverURL, jacketUrl: urls.albumCoverURL })
      .where('id = :albumId', { albumId })
      .execute();
  }

  async save(album: Album) {
    return await this.repository.save(album);
  }

  async findById(roomId: string) {
    return this.repository.findOne({
      where: { id: roomId },
    });
  }

  async saveTotalDuration(albumId: string, totalDuration: number) {
    const album = await this.repository.findOne({ where: { id: albumId } });
    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }
    album.setTotalDuration(totalDuration);
    await this.save(album);
  }

  async getAlbumBannerInfos(
    currentTime: Date,
  ): Promise<GetAlbumBannerInfosTuple[]> {
    const albumBannerInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select(['id as albumId', 'banner_url as bannerImageUrl'])
      .where('release_date > :currentTime', {
        currentTime,
      })
      .andWhere('release_date <= DATE_ADD(:currentTime, INTERVAL 7 DAY)', {
        currentTime,
      })
      .getRawMany();

    return plainToInstance(GetAlbumBannerInfosTuple, albumBannerInfos);
  }
}

export class GetAlbumBannerInfosTuple {
  albumId: string;
  bannerImageUrl: string;
}

export class GetSideBarInfosTuple {
  albumId: string;
  albumName: string;
  albumTags: string;
}
