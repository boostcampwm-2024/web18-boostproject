import { AlbumDetail } from '@/entities/album/types';
import { ChevronDown } from '@/shared/icon/ChevronDown';
import { useState } from 'react';
import './LyricsPanel.css';
import { useRef, useEffect } from 'react';
import Hls from 'hls.js';
import { useParams } from 'react-router-dom';
import { TestAudioController } from '@/pages/StreamingPage/ui/TestAudioController';
import { PlayIcon } from '@/shared/icon/PlayIcon';

interface AlbumInfoProps {
  album: AlbumDetail;
}

const CATEGORIES = {
  LYRICS: 'lyrics',
  PLAYLIST: 'playlist',
} as const;

function TrackDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('lyrics');

  return (
    <div
      className={`absolute bottom-0 w-full bg-grayscale-800 text-gray-100 rounded-t-lg 
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}`}
    >
      <TrackDetailHeader
        category={category}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCategory={setCategory}
      />
      <TrackDetailContent isOpen={isOpen} category={category} />
    </div>
  );
}

function TrackDetailContent({
  isOpen,
  category,
}: {
  isOpen: boolean;
  category: string;
}) {
  return (
    <div
      className={`px-6 py-4 h-64 transition-opacity duration-200 ease-in-out
    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {category === CATEGORIES.LYRICS ? <LyricsPanel /> : <PlaylistPanel />}
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

function LyricsPanel() {
  return (
    <div className="lyrics text-center h-full overflow-y-auto">
      모니터 앞에 또 밤을 새워 <br />
      끝없이 쏟아지는 에러 메시지 <br />
      콘솔창은 빨간색으로 가득해 <br />
      내 머리속은 스택 오버플로우 <br /> <br />
      우린 버그 헌터스 <br />
      코드 속을 헤매는 탐정이 되어 <br />
      우린 버그 헌터스 <br />
      완벽한 코드를 찾아 떠나는 여행자 <br /> <br />
      세미콜론 하나에 무너진 꿈 <br />
      인덴트 하나에 날아간 기능 <br />
      "동작은 하는데 왜 되는지 모르겠어" <br />
      내일의 나에게 맡기는 주석 <br />
      디버거는 내 유일한 친구 <br />
      테스트 코드는 나의 보험 <br />
      git blame은 차마 못 보겠어 <br /> 내 코드인 것 같기도 하고...
    </div>
  );
}

function PlaylistPanel() {
  return <p>플레이리스트</p>;
}

interface AlbumInfoProps {
  album: {
    tags: string[];
    title: string;
    artist: string;
    currentTime: string;
    coverImage: string;
    trackName: string;
  };
}

export function AlbumInfo({ album }: AlbumInfoProps) {
  const audioRef = useRef<HTMLMediaElement>(null);
  const { roomId } = useParams<{ roomId: string }>();
  const joinTimeStamp = 1700000004500;
  // const startTime = 1732165466570;
  const url = `http://localhost:3000/api/music/${roomId}/playlist.m3u8?joinTimeStamp=${joinTimeStamp}`;
  const [isLoaded, setIsLoaded] = useState(false);

  console.log(Date.now());

  const handleAudioPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play();
    setIsLoaded(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (Hls.isSupported()) {
      const hls = new Hls();

      hls.loadSource(url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, (data) => {
        setIsLoaded(true);
        console.log('HLS Manifest Parsed:');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        console.log('Full m3u8 Link:', url);
      });

      return () => {
        hls.destroy();
      };
    }
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    // 재생 시도
    // const currentOffset = (Date.now() - startTime) / 1000;
    // audio.currentTime = currentOffset;
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
        <p className="text-gray-300 mb-4">#{album.tags.join(' #')}</p>
        <p className="text-3xl font-bold mb-4">{album.title}</p>
        <p>{album.artist}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm mb-3">{album.currentTime}</p>
        <div className="relative flex justify-center items-center">
          <img
            src={album.coverImage}
            alt="Album Cover"
            className="w-52 h-52 object-cover rounded-t-lg"
          />
          {!isLoaded && (
            <>
              <button
                className="z-20 absolute px-4 py-2 rounded-lg text-xl bg-gray-700"
                onClick={handleAudioPlay}
              >
                <PlayIcon />
              </button>
              <div className="bg-gray-900 absolute top-0 w-full h-full opacity-70"></div>
            </>
          )}
        </div>

        <TestAudioController audioRef={audioRef} />
        <button className="text-sm text-gray-300 mt-3">재생</button>
        <p className="mt-4 text-2xl font-bold">{album.trackName}</p>
      </div>
      <TrackDetail />
    </div>
  );
}
