/**
 * 스트리밍 페이지에서 사용되는 앨범 정보
 */

export interface RoomResponse {
  success: boolean;
  albumResponse: AlbumData;
  songResponseList: SongData[];
  totalDuration: number;
  trackOrder: string;
}

export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  tags: string;
  bannerUrl: string | null;
  jacketUrl: string | null;
  releaseDate: string;
}

export interface SongData {
  id: number;
  albumId: string;
  title: string;
  trackNumber: number;
  lyrics: string;
  composer: string;
  writer: string;
  producer: string;
  instrument: string;
  source: string;
  duration: number;
}
