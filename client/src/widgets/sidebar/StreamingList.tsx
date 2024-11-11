import { StreamingListItem } from './StreamingListItem';
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
    <div className="p-8 pt-6 w-full">
      <hr className="border-0 h-[1px] bg-grayscale-600 mb-6" />
      <p className="text-grayscale-300 text-sm mb-4">스트리밍</p>
      <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-3">
        {roomList.map((room) => (
          <StreamingListItem key={room.roomId} room={room} />
        ))}
      </ul>
    </div>
  );
}
