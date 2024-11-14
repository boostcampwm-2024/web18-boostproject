import { useNavigate } from 'react-router-dom';

interface StreamingListItemProps {
  room: {
    roomId: string;
    album: string;
    singer: string;
    tags: string[];
    streamingStatus: boolean;
  };
}

export function StreamingListItem({ room }: StreamingListItemProps) {
  const navigate = useNavigate();
  const tagString = `#${room.tags.join(' #')}`;

  const handleClick = () => {
    navigate(`/streaming/${room.roomId}`);
  };

  return (
    <li className="cursor-pointer" onClick={handleClick}>
      <p className="text-grayscale-50 truncate">{room.album}</p>
      <p className="text-grayscale-400 text-xs truncate">{tagString}</p>
    </li>
  );
}
