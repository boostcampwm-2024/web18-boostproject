import { StreamingListItem } from '@/entities/streamingListItem';
import './StreamingList.css';
import { useEffect, useState } from 'react';

interface RoomData {
  roomId: string;
  album: string;
  singer: string;
  tags: string[];
  streamingStatus: boolean;
}

export default function StreamingList() {
  const [roomList, setRoomList] = useState<RoomData[]>([]);

  useEffect(() => {
    fetch('/rooms')
      .then((response) => response.json())
      .then((data) => {
        setRoomList(data.body);
      });
  }, []);

  return (
    <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-3">
      {roomList.map((room) => (
        <StreamingListItem key={room.roomId} room={room} />
      ))}
    </ul>
  );
}
