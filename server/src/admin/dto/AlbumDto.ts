import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { SongDto } from './SongDto';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsNotEmpty()
  @IsDateString()
  releaseDate: string;

  @IsString()
  releaseTime?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalTracks?: number;

  @IsArray()
  songs: SongDto[];
}
