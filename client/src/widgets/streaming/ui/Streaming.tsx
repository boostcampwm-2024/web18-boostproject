import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { SongDetail } from '@/features/songDetail';

interface StreamingProps {
  roomInfo: RoomResponse;
  songIndex: number;
  setSongIndex: (value: React.SetStateAction<number>) => void;
}

export function Streaming({
  roomInfo,
  songIndex,
  setSongIndex,
}: StreamingProps) {
  return (
    <div className="overflow-hidden relative w-full h-full">
      <AlbumBackground
        coverImage={roomInfo?.albumResponse?.jacketUrl ?? SampleAlbumCover}
      />
      <div className="flex justify-center">
        <div className="w-7/12 h-screen relative flex items-center justify-center">
          <AlbumInfo
            roomInfo={roomInfo}
            songIndex={songIndex}
            setSongIndex={setSongIndex}
          />
          <SongDetail songs={roomInfo.songResponseList} songIndex={songIndex} />
        </div>
      </div>
    </div>
  );
}
