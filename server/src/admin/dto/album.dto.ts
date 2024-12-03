import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { SongDto } from './song.dto';
import { Expose, Transform, Type } from 'class-transformer';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  artist: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  releaseDate: Date;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalTracks?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SongDto)
  songs: SongDto[];

  @IsString()
  @Expose({ name: 'albumTag' })
  tags: string;

  @IsNumber()
  totalDuration: number;

  @IsString()
  bannerUrl: string;

  @IsString()
  jacketUrl: string;

  public setBannerUrl(url: string) {
    this.bannerUrl = url;
  }

  public setJacketUrl(url: string) {
    this.jacketUrl = url;
  }
}
