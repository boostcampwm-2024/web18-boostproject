interface AlbumCard {
  albumId: string;
  albumName: string;
  artist: string;
  albumTags?: string;
  jacketUrl: string;
}

export function AlbumCard({ album }: { album: AlbumCard }) {
  const tagString = album.albumTags
    ? `#${album.albumTags.split(', ').join(' #')}`
    : '태그 없음';
  return (
    <li className="sm:w-12 md:w-20 lg:w-28 l:w-32 2xl:w-44">
      <img
        src={album.jacketUrl}
        alt={`${album.albumName} 앨범 커버`}
        className="mb-3 w-48 h-48 sm:w-12 sm:h-12 md:w-20 md:h-240 lg:w-28 lg:h-28 xl:w-32 xl:h-32 2xl:w-44 2xl:h-44"
      />
      <p className="text-xl font-semibold mb-1 truncate">{album.albumName}</p>
      <p className="mb-2">{album.artist}</p>
      <p className="text-grayscale-400 mb-1">{tagString}</p>
    </li>
  );
}
