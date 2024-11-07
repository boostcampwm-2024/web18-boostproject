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
  // 최적화 필요
  const tagString = `#${room.tags.join(' #')}`;
  const enterRoomHandler = () => {
    fetch('http://localhost:3000/room', {
      method: 'POST',
      body: JSON.stringify({ roomId: room.roomId }),
    }).then((response) => {
      if (response.ok) {
        console.log(`Entered room ${room.roomId}`);
      }
    });
  };
  return (
    <li>
      <div onClick={enterRoomHandler}>
        <p className="text-grayscale-50 truncate">{room.album}</p>
        <p className="text-grayscale-400 text-xs truncate">{tagString}</p>
      </div>
    </li>
  );
}
