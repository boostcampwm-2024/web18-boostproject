/**
 * 앨범 상세 페이지 댓글
 */
export interface CommentData {
  albumId: string;
  content: string;
  createdAt: string;
}

/**
 * 앨범 상세 페이지 서버 데이터
 */
export interface AlbumDetailResponse {
  albumDetails: AlbumDetailData;
  songDetails: SongDetailData[];
}

/**
 * 앨범 상세 앨범 정보
 */
export interface AlbumDetailData {
  albumId: string;
  albumName: string;
  artist: string;
  jacketUrl: string;
}

/**
 * 앨범 상세 페이지 노래 정보
 */
export interface SongDetailData {
  songName: string;
  songDuration: string;
}
