import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { SongDto } from '@/admin/dto/SongDto';

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

  constructor(songDto: SongDto) {
    this.albumId = songDto.albumId;
    this.title = songDto.title;
    this.trackNumber = songDto.trackNumber;
    this.lyrics = songDto.lyrics;
    this.composer = songDto.composer;
    this.writer = songDto.writer;
    this.instrument = songDto.instrument;
    this.source = songDto.source;
    this.duration = songDto.duration;
  }
}
