import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { AlbumDetail, SongDetail, RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export function Streaming() {
  const { roomId } = useParams<{ roomId: string }>();
  const [album, setAlbum] = useState<AlbumDetail>();
  const [songs, setSongs] = useState<SongDetail[]>([]);

  const getRoomInfo = async () => {
    const response = await axios.get<RoomResponse>(
      `http://localhost:3000/api/room/${roomId}`,
    );
    setAlbum(response.data.albumResponse);
    setSongs(response.data.songResponseList);
  };

  useEffect(() => {
    getRoomInfo();
  });

  return (
    <div className="bg-grayscale-400 w-3/4 relative overflow-hidden">
      <AlbumBackground coverImage={album?.jacketUrl ?? SampleAlbumCover} />
      <div className="absolute inset-0 flex justify-center pt-28 text-grayscale-100 z-10">
        {album && <AlbumInfo album={album} songs={songs} />}
      </div>
    </div>
  );
}
