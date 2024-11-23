import { ChevronDown } from '@/shared/icon/ChevronDown';
import { useState } from 'react';
import './LyricsPanel.css';
import { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { useParams } from 'react-router-dom';
import { AudioController } from '@/widgets/streaming/ui/AudioController';
import { PlayIcon } from '@/shared/icon/PlayIcon';
import { SongDetail, RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';

const CATEGORIES = {
  LYRICS: 'lyrics',
  PLAYLIST: 'playlist',
} as const;

function TrackDetail({
  songs,
  streamingIndex,
}: {
  songs: SongDetail[];
  streamingIndex: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('lyrics');

  return (
    <div
      className={`absolute bottom-0 w-full bg-grayscale-800 text-gray-100 rounded-t-lg 
      transform transition-transform duration-300 ease-in-out z-50
      ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}`}
    >
      <TrackDetailHeader
        category={category}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCategory={setCategory}
      />
      <TrackDetailContent
        isOpen={isOpen}
        category={category}
        songs={songs}
        streamingIndex={streamingIndex}
      />
    </div>
  );
}

function TrackDetailContent({
  isOpen,
  category,
  songs,
  streamingIndex,
}: {
  isOpen: boolean;
  category: string;
  songs: SongDetail[];
  streamingIndex: number;
}) {
  return (
    <div
      className={`px-6 py-4 h-64 transition-opacity duration-200 ease-in-out
    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {category === CATEGORIES.LYRICS ? (
        <LyricsPanel lyrics={songs[streamingIndex - 1].lyrics} />
      ) : (
        <PlaylistPanel />
      )}
    </div>
  );
}

function TrackDetailHeader({
  category,
  isOpen,
  setIsOpen,
  setCategory,
}: {
  category: string;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setCategory: (value: string) => void;
}) {
  return (
    <div className="flex flex-row justify-between px-6 py-4 items-center bg-grayscale-900 rounded-t-lg">
      <div className="flex flex-row space-x-4">
        <CategoryButton
          isActive={category === CATEGORIES.LYRICS}
          onClick={() => isOpen && setCategory(CATEGORIES.LYRICS)}
        >
          가사
        </CategoryButton>
        <CategoryButton
          isActive={category === CATEGORIES.PLAYLIST}
          onClick={() => isOpen && setCategory(CATEGORIES.PLAYLIST)}
        >
          플레이리스트
        </CategoryButton>
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`transform transition-transform duration-100 ease-in-out
      ${isOpen ? 'rotate-0' : 'rotate-180'}`}
      >
        <ChevronDown />
      </button>
    </div>
  );
}

interface CategoryButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function CategoryButton({ isActive, onClick, children }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`${isActive ? 'text-grayscale-100' : 'text-grayscale-500'}`}
    >
      {children}
    </button>
  );
}

function LyricsPanel({ lyrics }: { lyrics: string }) {
  const lyricsFormatted = lyrics
    .split('\n')
    .map((line, index) => <p key={index}>{line}</p>);
  return (
    <div className="lyrics text-center h-full overflow-y-auto">
      {lyricsFormatted}
    </div>
  );
}

function PlaylistPanel() {
  return <p>플레이리스트</p>;
}

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
      <TrackDetail
        songs={roomInfo.songResponseList}
        streamingIndex={Number(roomInfo.trackOrder)}
      />
    </div>
  );
}
