/**
 * 스트리밍 페이지에서 사용되는 앨범 정보
 */
export interface AlbumData {
  id: string;
  title: string;
  artist: string;
  tags: string;
  bannerUrl: string;
  jacketUrl: string;
}

export interface SongData {
  id: number;
  albumId: string;
  title: string;
  trackNumber: number;
  lyrics: string;
  composer: string;
  writer: string;
  instrument: string;
  source: string;
  duration: number;
}

export interface RoomResponse {
  success: boolean;
  albumResponse: AlbumData;
  songResponseList: SongData[];
  totalDuration: number;
  trackOrder: string;
}

/**
 * 메인 페이지 앨범 정보
 * 앨범의 간단한 정보만을 담고 있음
 */

export interface Album {
  id: number;
  title: string;
  artist: string;
  tags: string[];
  coverImage: string;
}
