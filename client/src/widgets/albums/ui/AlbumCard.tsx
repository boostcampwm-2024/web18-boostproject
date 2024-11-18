import { Album } from '@/entities/album/types';

export function AlbumCard({ album }: { album: Album }) {
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
