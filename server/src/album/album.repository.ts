import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { DataSource, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Song } from '@/song/song.entity';
import {
  AlbumDetailDto,
  AlbumDetailSongDto,
} from './dto/album-detail-response.dto';
import { EndedAlbumDto } from './dto/ended-album-response.dto';
import { SideBarDto } from './dto/side-bar-response.dto';

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

  async getReleaseDate(albumId: string): Promise<Date> {
    const album = await this.repository.findOne({ where: { id: albumId } });
    return album.releaseDate;
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
      .orderBy('release_date', 'ASC')
      .getRawMany();

    return plainToInstance(GetAlbumBannerInfosTuple, albumBannerInfos);
  }

  // 스트리밍 시작 시간 <= currentTIme < 스트리밍 끝나는 시간
  async getRecentSideBarInfos(currentTime: Date): Promise<SideBarDto[]> {
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
      .orderBy('release_date', 'ASC') 
      .getRawMany();

    return plainToInstance(SideBarDto, recentSideBarInfos);
  }

  // 스트리밍 끝나는 시간 < currentTime <= 현재시간으로 부터 30분 뒤
  async getUpComingSideBarInfos(currentTime: Date): Promise<SideBarDto[]> {
    const upComingAlbumInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select(['id as albumId', 'title as albumName', 'tags as albumTags'])
      .where('release_date > :currentTime', {
        currentTime,
      })
      .andWhere('release_date <= DATE_ADD(:currentTime, INTERVAL 30 MINUTE)', {
        currentTime,
      })
      .orderBy('release_date', 'ASC') 
      .getRawMany();

    return plainToInstance(SideBarDto, upComingAlbumInfos);
  }

  // 스트리밍 종료 시간 < 현재 시간, 종료된지 7일 이내인 앨범 최근 끝난 것부터 정렬
  async getEndedAlbumsInfos(currentTime: Date): Promise<EndedAlbumDto[]> {
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

    return plainToInstance(EndedAlbumDto, endedAlbumInfos);
  }

  async getAlbumDetailInfos(albumId: string): Promise<AlbumDetailDto> {
    const albumDetailInfos = await this.dataSource
      .createQueryBuilder()
      .from(Album, 'album')
      .select([
        'album.id as albumId',
        'album.title as albumName',
        'artist',
        'jacket_url as jacketUrl',
      ])
      .where('id = :albumId', { albumId })
      .getRawOne();

    return plainToInstance(AlbumDetailDto, albumDetailInfos);
  }

  async getAlbumDetailSongInfos(
    albumId: string,
  ): Promise<AlbumDetailSongDto[]> {
    const albumDetailSongInfos = await this.dataSource
      .createQueryBuilder()
      .from(Song, 'song')
      .select(['song.title as songName', 'song.duration as songDuration'])
      .where('album_id = :albumId', { albumId })
      .getRawMany();

    return plainToInstance(AlbumDetailSongDto, albumDetailSongInfos);
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
