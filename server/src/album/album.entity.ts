import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumDto } from '@/admin/dto/AlbumDto';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  artist: string;

  @Column({ type: 'varchar', length: 30 })
  tags: string;

  @Column({ name: 'release_date', type: 'char', length: 16, nullable: false })
  releaseDate: string;

  @Column({ name: 'banner_url', type: 'varchar', length: 500 })
  bannerUrl: string;

  @Column({ name: 'jacket_url', type: 'varchar', length: 500 })
  jacketUrl: string;

  constructor(albumDto?: AlbumDto) {
    if (!albumDto) return;
    this.title = albumDto.title;
    this.artist = albumDto.artist;
    this.tags = albumDto.tags;
    this.releaseDate = albumDto.releaseDate;
    this.bannerUrl = albumDto.bannerUrl;
    this.jacketUrl = albumDto.jacketUrl;
  }

  public getId() {
    return this.id;
  }
}
