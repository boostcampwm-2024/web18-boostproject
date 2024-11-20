import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  artist: string;

  @Column({ type: 'varchar', length: 30 })
  tags?: string;

  @Column({ name: 'release_time', type: 'timestamp', nullable: false })
  releaseTime: Date;

  @Column({ name: 'banner_url', type: 'varchar', length: 500 })
  bannerUrl?: string;

  @Column({ name: 'jacket_url', type: 'varchar', length: 500 })
  jacketUrl?: string;

  constructor(
    title: string,
    artist: string,
    tags: string,
    releaseTime: Date,
    bannerUrl: string = null,
    jacketUrl: string = null,
  ) {
    this.title = title;
    this.artist = artist;
    this.tags = tags;
    this.releaseTime = releaseTime;
    this.bannerUrl = bannerUrl;
    this.jacketUrl = jacketUrl;
  }
}
