import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export function Streaming() {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);

  const getRoomInfo = async () => {
    const response = await axios.get<RoomResponse>(
<<<<<<< HEAD
      `http://localhost:3000/api/room/${roomId}`,
=======
      `/api/room/${roomId}`,
>>>>>>> dev
    );
    console.log(response.data);
    setRoomInfo(response.data);
  };

  useEffect(() => {
    getRoomInfo();
  }, []);

  return (
    <div className="bg-grayscale-400 w-3/4 relative overflow-hidden">
      <AlbumBackground
        coverImage={roomInfo?.albumResponse?.jacketUrl ?? SampleAlbumCover}
      />
      <div className="absolute inset-0 flex justify-center pt-28 text-grayscale-100 z-10">
        {roomInfo && <AlbumInfo roomInfo={roomInfo} />}
      </div>
    </div>
  );
}
