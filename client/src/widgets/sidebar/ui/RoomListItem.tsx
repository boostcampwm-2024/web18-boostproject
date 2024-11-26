import { useNavigate } from 'react-router-dom';
import { AlbumData } from '@/entities/room/types';
interface RoomListItemProps {
  album: AlbumData;
}

export function RoomListItem({ album }: RoomListItemProps) {
  const navigate = useNavigate();
  const tagString = album.albumTags
    ? `#${album.albumTags.split(', ').join(' #')}`
    : '태그 없음';

  const handleClick = () => {
    navigate(`/streaming/${album.albumId}`);
  };

  return (
    <li className="cursor-pointer" onClick={handleClick}>
      <p className="text-grayscale-50 truncate">{album.albumName}</p>
      <p className="text-grayscale-400 text-xs truncate">{tagString}</p>
    </li>
  );
}
