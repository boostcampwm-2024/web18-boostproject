import { Expose } from 'class-transformer';

export class AlbumResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  artist: string;

  @Expose()
  tags: string;

  @Expose()
  releaseDate: Date;

  @Expose()
  bannerUrl: string;

  @Expose()
  jacketUrl: string;
}
