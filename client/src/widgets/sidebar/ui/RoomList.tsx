import { RoomListItem } from './RoomListItem';
import './StreamingList.css';
import { AlbumData } from '@/entities/room/types';
import { useSidebarAlbum } from '@/widgets/sidebar/hook/useSidebarAlbum';

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
  const { data: roomList, isLoading, isError } = useSidebarAlbum();

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
