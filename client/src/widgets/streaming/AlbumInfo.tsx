import { Album } from '@/entities/album/type';

interface AlbumInfoProps {
  album: Album;
}

export function AlbumInfo({ album }: AlbumInfoProps) {
  return (
    <div className="flex flex-col items-center w-1/2 relative">
      <div className="text-center mb-32 w-full">
        <p className="text-gray-300 mb-4">#{album.tags.join(' #')}</p>
        <p className="text-4xl font-bold mb-4">{album.title}</p>
        <p>{album.artist}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm mb-3">{album.currentTime}</p>
        <img
          src={album.coverImage}
          alt="Album Cover"
          className="w-52 h-52 object-cover rounded-lg mb-4"
        />
        <p className="text-2xl font-bold">{album.trackName}</p>
      </div>
      <div className="absolute bottom-0 bg-grayscale-900 w-full h-52"></div>
    </div>
  );
}
