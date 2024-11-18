import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

interface SongInfo {
  title: string;
  trackNumber: number;
}

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

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalTracks?: number;

  songs: SongInfo[];
}
