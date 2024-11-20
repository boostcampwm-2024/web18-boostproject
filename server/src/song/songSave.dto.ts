import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SongSaveDto {
  @IsString()
  @IsNotEmpty()
  albumId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  trackNumber: number;

  @IsString()
  lyrics?: string;

  @IsString()
  composer: string;

  @IsString()
  writer: string;

  @IsString()
  instrument: string;

  @IsString()
  source: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  constructor(
    albumId: number,
    title: string,
    trackNumber: number,
    lyrics: string,
    composer: string,
    writer: string,
    instrument: string,
    source: string,
    duration: string,
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
