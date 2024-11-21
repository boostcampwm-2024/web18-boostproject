import { Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SongResponseDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  albumId: string;

  @Expose()
  @IsString()
  title: string;

  @Expose()
  @IsNumber()
  trackNumber: string;

  @Expose()
  lyrics: string;

  @Expose()
  @IsString()
  composer: string;

  @Expose()
  @IsString()
  writer: string;

  @Expose()
  @IsString()
  instrument: string;

  @Expose()
  source: string;

  @Expose()
  @IsString()
  duration: string;
}
