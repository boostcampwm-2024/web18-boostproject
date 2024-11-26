import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  trackNumber: number;

  @IsString()
  lyrics?: string;

  @IsString()
  producer: string;

  @IsString()
  composer: string;

  @IsString()
  writer: string;

  @IsString()
  instrument: string;

  @IsString()
  source: string;

  constructor(
    title: string,
    trackNumber: number,
    producer: string,
    composer: string,
    writer: string,
    instrument: string,
    source: string,
    lyrics?: string,
  ) {
    this.title = title;
    this.trackNumber = trackNumber;
    this.producer = producer;
    this.composer = composer;
    this.writer = writer;
    this.instrument = instrument;
    this.source = source;
    this.lyrics = lyrics;
  }
}
