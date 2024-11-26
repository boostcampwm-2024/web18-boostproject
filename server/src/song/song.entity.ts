import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SongSaveDto } from '@/song/dto/song-save.dto';
import { Album } from '@/album/album.entity';

@Entity()
export class Song {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'album_id', type: 'char', length: 36 })
  albumId: string;

  @ManyToOne(() => Album, { nullable: false })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @Column({ type: 'varchar', length: 50, nullable: false })
  title: string;

  @Column({ name: 'track_number', type: 'int', nullable: false })
  trackNumber: number;

  @Column({ type: 'text' })
  lyrics: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  producer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  composer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  writer: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  instrument: string;

  @Column({ name: 'sources', type: 'varchar', length: 50 })
  source: string;

  @Column({ type: 'int', nullable: false })
  duration: number;

  constructor(songDto?: SongSaveDto) {
    if (!songDto) return;
    this.albumId = songDto.albumId;
    this.title = songDto.title;
    this.trackNumber = songDto.trackNumber;
    this.lyrics = songDto.lyrics;
    this.producer = songDto.producer;
    this.composer = songDto.composer;
    this.writer = songDto.writer;
    this.instrument = songDto.instrument;
    this.source = songDto.source;
    this.duration = songDto.duration;
  }
}
