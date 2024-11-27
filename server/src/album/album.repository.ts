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

  async delete(albumId: string) {
    await this.repository.delete({ id: albumId });
  }

  async saveTotalDuration(albumId: string, totalDuration: number) {
    const album = await this.repository.findOne({ where: { id: albumId } });
    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }
    album.setTotalDuration(totalDuration);
    await this.save(album);
  }

  async updateReleaseDate(albumId: string, minutes: number): Promise<void> {
    const album = await this.findById(albumId);
    if (!album) {
      throw new NotFoundException(`Album ${albumId} not found`);
    }

    await this.repository
      .createQueryBuilder()
      .update(Album)
      .set({
        releaseDate: () => `DATE_ADD(release_date, INTERVAL ${minutes} MINUTE)`,
      })
      .where('id = :albumId', { albumId })
      .execute();
  }

  // 3일 이내 앨범 표시
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
      .where(
        'DATE_ADD(release_date, INTERVAL total_duration SECOND) > :currentTime',
        {
          currentTime,
        },
      )
      .andWhere('release_date <= DATE_ADD(:currentTime, INTERVAL 3 DAY)', {
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

  // 스트리밍 종료 시간 < 현재 시간, 종료된지 7일 이내인 앨범 최근 끝난 것부터 정렬
  async getEndedAlbumsInfos(
    currentTime: Date,
  ): Promise<GetEndedAlbumInfosTuple[]> {
    const endedAlbumInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select([
        'id as albumId',
        'title as albumName',
        'artist',
        'tags as albumTags',
        'jacket_url as jacketUrl',
      ])
      .where(
        'DATE_ADD(release_date, INTERVAL total_duration SECOND) < :currentTime',
        { currentTime },
      )
      .andWhere(
        'DATE_ADD(DATE_ADD(release_date, INTERVAL total_duration SECOND), INTERVAL 7 DAY) > :currentTime',
      )
      .orderBy('DATE_ADD(release_date, INTERVAL total_duration SECOND)', 'DESC')
      .getRawMany();

    return plainToInstance(GetEndedAlbumInfosTuple, endedAlbumInfos);
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

export class GetEndedAlbumInfosTuple {
  albumId: string;
  albumName: string;
  artist: string;
  albumTags: string;
  jacketUrl: string;
}
