import LogoAlbum from '@/assets/logo-album-cover.png';
import { AlbumCard } from './AlbumCard';
import { Album } from '@/entities/album/types';

const mockAlbums: Album[] = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  title: '앨범명명명',
  artist: '가수명명명',
  tags: ['태그', '태그', '태그'],
  coverImage: LogoAlbum,
}));

export function AlbumList() {
  return (
    <div className="text-grayscale-50">
      <p className="mt-[70px] mb-7 text-3xl font-bold">최근 등록된 앨범</p>
      <ul className="flex flex-row flex-wrap gap-9 ">
        {mockAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </ul>
    </div>
  );
}
