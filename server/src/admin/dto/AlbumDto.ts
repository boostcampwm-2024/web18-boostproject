import {
  IsArray,
  IsISO8601,
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
  @IsISO8601()
  releaseDate: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalTracks?: number;

  @IsArray()
  songs: SongDto[];
}
