import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongSaveDto } from '@/song/songSave.dto';
import { Album } from '@/album/album.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  private id: number;

  @ManyToOne(() => Album, { nullable: false })
  @JoinColumn({ name: 'album_id' })
  private albumId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  private title: string;

  @Column({ name: 'track_number', type: 'int', nullable: false })
  private trackNumber!: number;

  @Column({ type: 'text' })
  private lyrics: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private composer!: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private writer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  private instrument!: string;

  @Column({ name: 'sources', type: 'varchar', length: 50 })
  private source: string;

  @Column({ type: 'int', nullable: false })
  private duration: number;

  constructor(songDto?: SongSaveDto) {
    if (!songDto) return;
    this.albumId = songDto.albumId;
    this.title = songDto.title;
    this.trackNumber = songDto.trackNumber;
    this.lyrics = songDto.lyrics;
    this.composer! = songDto.composer;
    this.writer! = songDto.writer;
    this.instrument! = songDto.instrument;
    this.source = songDto.source;
    this.duration! = songDto.duration;
  }
}
