/**
 * 관리자 페이지에서 앨범 등록을 위한 요청을 보낼 때 사용하는 타입
 */
export interface CreateAlbumRequest {
  title: string;
  artist: string;
  album_tag: string[];
  releaseDate: string;
  releaseTime: string;
  songs?: Song[];
}

export interface AlbumImageRequest {
  album_cover: any;
  banner_cover?: any;
}

/**
 * 앨범에 포함된 곡 정보
 */
export interface Song {
  title: string;
  trackNumber: string;
  lyrics?: string;
  composer?: string;
  playtime: string;
  writer?: string;
  instrument?: string;
  producer?: string;
  source?: string;
  // file: any;
}

export interface SongFilesRequest {
  files: any[];
}
