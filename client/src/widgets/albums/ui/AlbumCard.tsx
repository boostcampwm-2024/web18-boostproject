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
    <li>
      <img
        src={album.jacketUrl}
        alt={`${album.albumName} 앨범 커버`}
        className="mb-3 w-[200px] h-[200px] object-cover"
      />
      <p className="text-xl font-semibold mb-1 truncate">{album.albumName}</p>
      <p className="mb-2">{album.artist}</p>
      <p className="text-grayscale-400 mb-1">{tagString}</p>
    </li>
  );
}
