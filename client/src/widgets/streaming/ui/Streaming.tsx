import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { SongDetail } from '@/features/songDetail';

export function Streaming() {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);

  const getRoomInfo = async () => {
    const response = await axios.get<RoomResponse>(`/api/room/${roomId}`);
    setRoomInfo(response.data);
  };

  useEffect(() => {
    getRoomInfo();
  }, []);

  return (
    <div className="overflow-hidden relative w-3/4 h-full">
      {roomInfo && (
        <>
          <AlbumBackground
            coverImage={roomInfo?.albumResponse?.jacketUrl ?? SampleAlbumCover}
          />
          <div className="flex justify-center">
            <div className="w-7/12 h-screen relative flex items-center justify-center">
              <AlbumInfo roomInfo={roomInfo} />
              <SongDetail
                songs={roomInfo.songResponseList}
                streamingIndex={Number(roomInfo.trackOrder)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
