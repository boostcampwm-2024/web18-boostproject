import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SongDetail } from '@/features/songDetail';
import { publicAPI } from '@/shared/api/publicAPI';
export function Streaming() {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [songIndex, setSongIndex] = useState<number>(0);

  const getRoomInfo = async () => {
    if (!roomId) return;
    const res: RoomResponse = await publicAPI
      .getRoomInfo(roomId)
      .then((res) => res)
      .catch((err) => console.log(err));
    console.log(res);
    setRoomInfo(res);
    setSongIndex(Number(res.trackOrder));
  };
  useEffect(() => {
    getRoomInfo();
  }, []);
  return (
    <div className="overflow-hidden relative w-3/4 h-full">
      {roomInfo && songIndex && (
        <>
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
              <SongDetail
                songs={roomInfo.songResponseList}
                songIndex={songIndex}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
