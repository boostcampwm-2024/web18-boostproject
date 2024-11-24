import { useState } from 'react';
import './LyricsPanel.css';
import { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { useParams } from 'react-router-dom';
import { AudioController } from '@/widgets/streaming/ui/AudioController';
import { PlayIcon } from '@/shared/icon/PlayIcon';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';
import { SongDetail } from '@/features/songDetail';

interface AlbumInfoProps {
  roomInfo: RoomResponse;
}

export function AlbumInfo({ roomInfo }: AlbumInfoProps) {
  const audioRef = useRef<HTMLMediaElement>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const [isLoaded, setIsLoaded] = useState(false);

  console.log(roomInfo);
  if (!roomInfo.success) {
    return <StreamingErrorPage />;
  }

  const playStream = () => {
    console.log('playStream');
    const audio = audioRef.current;
    if (!audio) return;
    const streamUrl = `/api/music/${roomId}/playlist.m3u8?joinTimeStamp=1700000000000`;
    if (Hls.isSupported()) {
      const hls = new Hls({
        maxBufferLength: 30, // 버퍼 길이 제한
        maxMaxBufferLength: 60, // 최대 버퍼 길이
        maxBufferSize: 60 * 1000000, // 버퍼 크기 제한 (60MB)
        maxBufferHole: 0.5, // 버퍼 홀 허용 범위
        lowLatencyMode: true, // 낮은 지연 모드
        backBufferLength: 30, // 뒤로 가기 버퍼 길이
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoaded(true);
      });

      hls.on(Hls.Events.ERROR, function (data) {
        console.error('Error event:', data);
      });
    } else {
      console.error('HLS is not supported');
    }
  };
  useEffect(() => {
    playStream();
    console.log(Date.now());
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsLoaded(false);
      playStream();
    };
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    audio.play().catch((error) => {
      if (error.name === 'NotAllowedError') {
        setIsLoaded(false);
      } else {
        console.error('Failed to play audio', error);
      }
    });
  }, [isLoaded]);

  return (
    <div className="flex flex-col items-center w-7/12 relative">
      <audio ref={audioRef} controls controlsList="nodownload" />
      <div className="text-center mb-32 w-full">
        <p className="text-gray-300 mb-4">
          #{roomInfo.albumResponse.tags.split(', ').join(' #')}
        </p>
        <p className="text-3xl font-bold mb-4">
          {roomInfo.albumResponse.title}
        </p>
        <p>{roomInfo.albumResponse.artist}</p>
      </div>
      <div className="relative flex flex-col items-center">
        {/* <p className="text-sm mb-3">{album.currentTime}</p> */}
        <div className="relative flex justify-center items-center">
          <img
            src={roomInfo.albumResponse.jacketUrl ?? SampleAlbumCover}
            alt="Album Cover"
            className="w-52 h-52 object-cover rounded-t-lg"
          />
          {!isLoaded && (
            <>
              <button
                className="z-10 absolute px-4 py-2 rounded-lg text-xl bg-gray-700"
                onClick={playStream}
              >
                <PlayIcon />
              </button>
              <div className="bg-gray-900 absolute top-0 w-full h-full opacity-70"></div>
            </>
          )}
        </div>
        <div className="absolute bottom-0 w-full">
          <AudioController
            audioRef={audioRef}
            songDuration={
              roomInfo.songResponseList[Number(roomInfo.trackOrder) - 1]
                .duration
            }
          />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">
        {roomInfo.songResponseList[Number(roomInfo.trackOrder) - 1].title}
      </p>
      <SongDetail
        songs={roomInfo.songResponseList}
        streamingIndex={Number(roomInfo.trackOrder)}
      />
    </div>
  );
}
