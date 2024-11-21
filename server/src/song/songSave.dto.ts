import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SongDto } from '@/admin/dto/SongDto';

export class SongSaveDto extends SongDto {
  @IsString()
  @IsNotEmpty()
  albumId: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  constructor({
    albumId,
    title,
    trackNumber,
    lyrics = null,
    composer,
    writer,
    instrument,
    source,
    duration,
  }) {
    super(title, trackNumber, composer, writer, instrument, source, lyrics);
    this.albumId = albumId;
    this.duration = duration;
  }
}
