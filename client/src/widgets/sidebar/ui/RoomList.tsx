import { useEffect, useState } from 'react';
import { RoomListItem } from './RoomListItem';
import './StreamingList.css';
import { publicAPI } from '@/shared/api/publicAPI';
import { SidebarListResponse, AlbumData } from '@/entities/room/types';

function RoomListContainer({
  albums,
  title,
}: {
  albums?: AlbumData[];
  title: string;
}) {
  return (
    <div>
      <p className="text-grayscale-300 text-sm mb-2">{title}</p>
      {albums?.length !== 0 ? (
        <ul className="streaming-list flex flex-col gap-2 max-h-48 overflow-y-auto pr-3">
          {albums?.map((album) => (
            <RoomListItem key={album.albumId} album={album} />
          ))}
        </ul>
      ) : (
        <p className="text-grayscale-500 text-xs">방이 없습니다</p>
      )}
    </div>
  );
}

export function RoomList() {
  const [roomList, setRoomList] = useState<SidebarListResponse>();

  useEffect(() => {
    const getAlbumSidebar = async () => {
      const res = await publicAPI
        .getAlbumSidebar()
        .then((res) => res)
        .catch((err) => console.log(err));
      setRoomList(res.result);
    };

    getAlbumSidebar();
  }, []);

  return (
    <div className="p-8 pt-6 w-full flex flex-col gap-8">
      <RoomListContainer
        albums={roomList?.streamingAlbums}
        title="스트리밍 진행 중"
      />
      <RoomListContainer
        albums={roomList?.upComingAlbums}
        title="곧 시작합니다"
      />
    </div>
  );
}
