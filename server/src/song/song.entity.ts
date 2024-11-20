import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ name: 'album_id', type: 'int', nullable: false })
  private albumId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  private title: string;

  @Column({ name: 'track_number', type: 'int', nullable: false })
  private trackNumber: number;

  @Column({ type: 'text' })
  private lyrics: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private composer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private writer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private instrument: string;

  @Column({ name: 'sources', type: 'varchar', length: 50 })
  private source: string;

  @Column({ type: 'int', nullable: false })
  private duration: number;

  constructor(
    albumId: number,
    title: string,
    trackNumber: number,
    lyrics: string = null,
    composer: string,
    writer: string,
    instrument: string,
    source: string = null,
    duration: number,
  ) {
    this.albumId = albumId;
    this.title = title;
    this.trackNumber = trackNumber;
    this.lyrics = lyrics;
    this.composer = composer;
    this.writer = writer;
    this.instrument = instrument;
    this.source = source;
    this.duration = duration;
  }
}
