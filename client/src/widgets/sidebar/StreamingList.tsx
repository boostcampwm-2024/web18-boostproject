import { StreamingListItem } from './StreamingListItem';
import './StreamingList.css';

interface RoomData {
  roomId: string;
  album: string;
  singer: string;
  tags: string[];
  streamingStatus: boolean;
}

const dummyRoomList: RoomData[] = [
  {
    roomId: 'room_17',
    album: '로제의 APT.',
    singer: '로제',
    tags: ['힙합'],
    streamingStatus: true,
  },
];

export default function StreamingList() {
  return (
    <div className="p-8 pt-6 w-full">
      <hr className="border-0 h-[1px] bg-grayscale-600 mb-6" />
      <p className="text-grayscale-300 text-sm mb-4">스트리밍</p>
      <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-3">
        {dummyRoomList.map((room) => (
          <StreamingListItem key={room.roomId} room={room} />
        ))}
      </ul>
    </div>
  );
}
