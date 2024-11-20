import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class SongDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(1)
  trackNumber: number;

  @IsString()
  lyrics: string;

  @IsString()
  composer: string;

  @IsString()
  writer: string;

  @IsString()
  instrument: string;

  @IsString()
  source: string;
}
