export interface Album {
  id: number;
  title: string;
  artist: string;
  tags: string[];
  coverImage: string;
}

interface AlbumCardProps {
  album: Album;
}

// 태그 문장으로 만드는 코드 util로 만들어서 사용하기
export function AlbumCard({ album }: AlbumCardProps) {
  return (
    <li>
      <img
        src={album.coverImage}
        alt={`${album.title} 앨범 커버`}
        className="mb-3"
      />
      <p className="text-xl font-semibold mb-1">{album.title}</p>
      <p className="mb-2">{album.artist}</p>
      <p className="text-grayscale-400 mb-1">#{album.tags.join(' #')}</p>
    </li>
  );
}
