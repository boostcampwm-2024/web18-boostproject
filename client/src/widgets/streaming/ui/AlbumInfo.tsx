import { useParams } from 'react-router-dom';
import { AudioController } from '@/widgets/streaming/ui/AudioController';
import { PlayIcon } from '@/shared/icon/PlayIcon';
import { RoomResponse } from '@/entities/album/types';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';
import { useStreamingPlayer } from '@/features/albumStreaming/hook/useStreamingPlayer';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';
import { Volume } from '@/shared/icon/Volume';
import { useState, useEffect } from 'react';
import './Volume.css';
import { VolumeMuted } from '@/shared/icon/VolumeMuted.tsx';

interface AlbumInfoProps {
  roomInfo: RoomResponse;
  songIndex: number;
  setSongIndex: (value: React.SetStateAction<number>) => void;
}

export function AlbumInfo({
  roomInfo,
  songIndex,
  setSongIndex,
}: AlbumInfoProps) {
  const { roomId } = useParams<{ roomId: string }>();
  const [volume, setVolume] = useState<number>(0.1);
  const [backupVolume, setBackupVolume] = useState<number>(0.5);
  const [isVolumeOpen, setIsVolumeOpen] = useState<boolean>(false);
  if (!roomId) return;
  const { audioRef, isLoaded, playStream, error } = useStreamingPlayer(
    roomId,
    songIndex,
    setSongIndex,
    roomInfo.songResponseList.length,
  );

  if (error) {
    throw error;
  }
  if (!roomInfo.success) {
    throw new Error('방 정보를 불러오는 중 오류가 발생했습니다.');
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value) / 100;
    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleVolumeMuted = () => {
    if (!audioRef.current) return;
    if (volume <= 0) {
      setVolume(backupVolume);
      audioRef.current.volume = backupVolume;
    }
    if (volume > 0) {
      setBackupVolume(volume);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  const handleMouseEnter = () => {
    if (!isVolumeOpen) {
      setIsVolumeOpen(!isVolumeOpen);
    }
  };

  const handleMouseLeave = () => {
    if (isVolumeOpen) {
      setIsVolumeOpen(!isVolumeOpen);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    console.log('volume', volume);
  }, [audioRef.current, isLoaded]);

  return (
    <div className="flex flex-col items-center relative text-grayscale-100">
      <audio
        ref={audioRef}
        controls
        autoPlay
        playsInline
        controlsList="nodownload"
      />
      <div
        className={`fixed top-6 right-[364px] bg-grayscale-900 p-2 rounded-full flex flex-row items-center`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className={`volume-range ${isVolumeOpen ? 'w-36 ml-2 mr-2' : 'w-0'}`}
        />
        <div className="cursor-pointer" onClick={handleVolumeMuted}>
          {volume <= 0 ? <VolumeMuted /> : <Volume />}
        </div>
      </div>
      <div className="text-center mb-20 w-full">
        <p className="text-gray-300 mb-4">
          {roomInfo.albumResponse.tags
            ? `#${roomInfo.albumResponse.tags.split(', ').join(' #')}`
            : ''}
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
            songDuration={roomInfo.songResponseList[songIndex - 1]?.duration}
          />
        </div>
      </div>
      <p className="mt-4 text-2xl font-bold">
        {roomInfo.songResponseList[songIndex - 1]?.title}
      </p>
    </div>
  );
}
