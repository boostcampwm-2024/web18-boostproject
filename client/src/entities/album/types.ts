/**
 * 스트리밍 페이지에서 사용되는 앨범 정보
 * trackName이 아니라 앨범 내의 트랙 리스트로 들어와야함.
 */
export interface AlbumDetail {
  coverImage: string;
  tags: string[];
  title: string;
  artist: string;
  currentTime: string;
  trackName: string;
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
