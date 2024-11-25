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

  async updateCoverById(albumId: string, coverURL: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Album)
      .set({ jacketUrl: coverURL })
      .where('id = :albumId', { albumId })
      .execute();
  }

  async updateBannerById(albumId: string, bannerUrl: string): Promise<void> {
    await this.repository
      .createQueryBuilder()
      .update(Album)
      .set({ bannerUrl })
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
      .select([
        'id as albumId',
        'title as albumName',
        'tags as albumTags',
        'artist',
        'release_date as releaseDate',
        'banner_url as bannerImageUrl',
      ])
      .where('release_date > :currentTime', {
        currentTime,
      })
      .andWhere('release_date <= DATE_ADD(:currentTime, INTERVAL 7 DAY)', {
        currentTime,
      })
      .getRawMany();

    return plainToInstance(GetAlbumBannerInfosTuple, albumBannerInfos);
  }

  // 스트리밍 시작 시간 <= currentTIme < 스트리밍 끝나는 시간
  async getRecentSideBarInfos(
    currentTime: Date,
  ): Promise<GetSideBarInfosTuple[]> {
    const recentSideBarInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select(['id as albumId', 'title as albumName', 'tags as albumTags'])
      .where('release_date <= :currentTime', {
        currentTime,
      })
      .andWhere(
        'DATE_ADD(release_date, INTERVAL total_duration SECOND) > :currentTime',
        {
          currentTime,
        },
      )
      .getRawMany();

    return plainToInstance(GetSideBarInfosTuple, recentSideBarInfos);
  }

  // 스트리밍 끝나는 시간 < currentTime <= 현재시간으로 부터 6시간 뒤
  async getUpComingSideBarInfos(
    currentTime: Date,
  ): Promise<GetSideBarInfosTuple[]> {
    const upComingAlbumInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select(['id as albumId', 'title as albumName', 'tags as albumTags'])
      .where('release_date > :currentTime', {
        currentTime,
      })
      .andWhere('release_date <= DATE_ADD(:currentTime, INTERVAL 6 HOUR)', {
        currentTime,
      })
      .getRawMany();

    return plainToInstance(GetSideBarInfosTuple, upComingAlbumInfos);
  }
}

export class GetAlbumBannerInfosTuple {
  albumId: string;
  albumName: string;
  albumTags: string;
  artist: string;
  releaseDate: Date;
  bannerImageUrl: string;
}

export class GetSideBarInfosTuple {
  albumId: string;
  albumName: string;
  albumTags: string;
}
