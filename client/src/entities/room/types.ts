/**
 * 메인 페이지 사이드바 앨범 정보
 * 앨범의 간단한 정보만을 담고 있음
 */
export interface SidebarListResponse {
  streamingAlbums: AlbumData[];
  upComingAlbums: AlbumData[];
}
export interface AlbumData {
  albumId: number;
  albumName: string;
  albumTags?: string;
}

/**
 * 메인 페이지 배너 정보
 */
export interface bannerData {
  albumId: string;
  albumName: string;
  albumTags?: string;
  artist: string;
  bannerImageUrl: string;
  currentUserCount: number;
  releaseDate: string;
}

/**
 * 메인 페이지 최근 스트리밍 앨범 정보
 */

export interface EndedAlbumListResponse {
  endedAlbums: EndedAlbumData[];
}

export interface EndedAlbumData {
  albumId: string;
  albumName: string;
  artist: string;
  albumTags?: string;
  jacketUrl?: string;
}
