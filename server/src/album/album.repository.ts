import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from '@/album/album.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumRepository {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
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
}
