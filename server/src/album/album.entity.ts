import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { AlbumDto } from '@/admin/dto/album.dto';

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

  @Column({
    name: 'release_date',
    type: 'timestamp',
    nullable: false,
  })
  releaseDate: Date;

  @Column({ name: 'total_duration', type: 'int' })
  totalDuration: number;

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
    this.totalDuration = albumDto.totalDuration;
    this.bannerUrl = albumDto.bannerUrl;
    this.jacketUrl = albumDto.jacketUrl;
  }

  public getId() {
    return this.id;
  }

  // 소수 잘려있는 것 대비해 2초 추가
  public setTotalDuration(totalDuration: number) {
    this.totalDuration = totalDuration + 2;
  }
}
