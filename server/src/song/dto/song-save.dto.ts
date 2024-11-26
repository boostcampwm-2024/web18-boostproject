import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SongDto } from '@/admin/dto/song.dto';

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
    producer,
    composer,
    writer,
    instrument,
    source,
    duration,
  }) {
    super(
      title,
      trackNumber,
      producer,
      composer,
      writer,
      instrument,
      source,
      lyrics,
    );
    this.albumId = albumId;
    this.duration = duration;
  }
}
