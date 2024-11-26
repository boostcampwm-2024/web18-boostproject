import { useEffect, useState } from 'react';
import { RoomListItem } from './RoomListItem';
import './StreamingList.css';
import { publicAPI } from '@/shared/api/publicAPI';
interface RoomData {
  roomId: string;
  album: string;
  singer: string;
  tags: string[];
  streamingStatus: boolean;
}

const dummyRoomList: RoomData[] = [
  {
    roomId: 'RANDOM_AHH_ALBUM_ID',
    album: '로제의 APT.',
    singer: '로제',
    tags: ['힙합'],
    streamingStatus: true,
  },
];

function RoomListContainer({
  roomList,
  title,
}: {
  roomList: RoomData[];
  title: string;
}) {
  return (
    <div>
      <p className="text-grayscale-300 text-sm mb-2">{title}</p>
      <ul className="streaming-list flex flex-col gap-2 max-h-48 overflow-y-auto pr-3">
        {roomList.map((room) => (
          <RoomListItem key={room.roomId} room={room} />
        ))}
      </ul>
    </div>
  );
}

export function RoomList() {
  const [roomList, setRoomList] = useState<RoomData[]>([]);

  useEffect(() => {
    publicAPI
      .getAlbumSidebar()
      .then((data) => {
        setRoomList(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="p-8 pt-6 w-full flex flex-col gap-8">
      <RoomListContainer roomList={dummyRoomList} title="스트리밍" />
      <RoomListContainer roomList={dummyRoomList} title="곧 시작합니다" />
    </div>
  );
}
