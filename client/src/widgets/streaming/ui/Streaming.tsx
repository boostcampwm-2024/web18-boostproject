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
  // const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);

  const roomInfo: RoomResponse = {
    success: true,
    albumResponse: {
      id: 'album_2023_001',
      title: 'Blue Wave',
      artist: 'Ocean Sound',
      tags: 'jazz, piano, instrumental',
      bannerUrl: null,
      jacketUrl: null,
    },
    songResponseList: [
      {
        id: 1,
        albumId: 'album_2023_001',
        title: 'Morning Waves',
        trackNumber: 1,
        lyrics: 'Instrumental piece - no lyrics',
        composer: 'Sarah Johnson',
        writer: 'Sarah Johnson',
        instrument: 'Piano, Strings',
        source:
          'Original CompositionOriginal CompositionOriginal CompositionOriginal CompositionOriginal CompositionOriginal CompositionOriginal CompositionOriginal Compositionaaaaaaaabbbbbbbvcvcvcvcccvcvcvcv',
        duration: 235,
      },
      {
        id: 2,
        albumId: 'album_2023_001',
        title: 'Sunset Melody',
        trackNumber: 2,
        lyrics: 'Instrumental piece - no lyrics',
        composer: 'Sarah Johnson',
        writer: 'Sarah Johnson',
        instrument: 'Piano, Saxophone',
        source: 'Original Composition',
        duration: 184,
      },
      {
        id: 3,
        albumId: 'album_2023_001',
        title: 'Ocean Dreams',
        trackNumber: 3,
        lyrics: 'Instrumental piece - no lyrics',
        composer: 'Sarah Johnson',
        writer: 'Sarah Johnson',
        instrument: 'Piano, Percussion',
        source: 'Original Composition',
        duration: 198,
      },
      {
        id: 4,
        albumId: 'album_2023_004',
        title: 'Late Night Blues',
        trackNumber: 1,
        lyrics: 'Instrumental',
        composer: 'James Wilson',
        writer: 'James Wilson',
        instrument: 'Saxophone, Piano',
        source: 'Live Recording',
        duration: 235, // 3:55
      },
      {
        id: 5,
        albumId: 'album_2023_004',
        title: 'Moonlight Serenade',
        trackNumber: 2,
        lyrics: 'Instrumental',
        composer: 'James Wilson',
        writer: 'James Wilson',
        instrument: 'Saxophone, Double Bass',
        source: 'Live Recording',
        duration: 184, // 3:04
      },
      {
        id: 6,
        albumId: 'album_2023_004',
        title: 'Autumn Leaves',
        trackNumber: 3,
        lyrics: 'Instrumental',
        composer: 'James Wilson',
        writer: 'James Wilson',
        instrument: 'Saxophone, Drums',
        source: 'Live Recording',
        duration: 198, // 3:18
      },
      {
        id: 7,
        albumId: 'album_2023_004',
        title: 'City Lights',
        trackNumber: 4,
        lyrics: 'Instrumental',
        composer: 'James Wilson',
        writer: 'James Wilson',
        instrument: 'Saxophone, Piano',
        source: 'Live Recording',
        duration: 212, // 3:32
      },
      {
        id: 8,
        albumId: 'album_2023_004',
        title: 'Midnight Walk',
        trackNumber: 5,
        lyrics: 'Instrumental',
        composer: 'James Wilson',
        writer: 'James Wilson',
        instrument: 'Saxophone, Piano, Drums',
        source: 'Live Recording',
        duration: 225, // 3:45
      },
    ],
    totalDuration: 617,
    trackOrder: '1',
  };
  // const getRoomInfo = async () => {
  //   const response = await axios.get<RoomResponse>(
  //     `http://localhost:3000/api/room/${roomId}`,
  //   );
  //   setRoomInfo(response.data);
  // };

  // useEffect(() => {
  //   getRoomInfo();
  // }, []);
  const [songIndex, setSongIndex] = useState(Number(roomInfo.trackOrder));
  console.log(songIndex);
  return (
    <div className="overflow-hidden relative w-3/4 h-full">
      {roomInfo && (
        <>
          <AlbumBackground
            coverImage={roomInfo?.albumResponse?.jacketUrl ?? SampleAlbumCover}
          />
          <div className="flex justify-center">
            <div className="w-7/12 h-screen relative flex items-center justify-center">
              <button
                className="absolute top-0 left-0 p-4 bg-grayscale-50"
                onClick={() => setSongIndex((prev) => prev + 1)}
              >
                다음노래
              </button>
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
