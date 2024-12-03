import { useCallback, useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { DEFAULT_STREAMING_CONFIG } from './constants';
import { useNavigate } from 'react-router-dom';

export const useStreamingPlayer = (
  roomId: string,
  songIndex: number,
  setSongIndex: (value: React.SetStateAction<number>) => void,
  totalSongs: number,
) => {
  const audioRef = useRef<HTMLMediaElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);
  const createStreamUrl = (roomId: string) =>
    `${import.meta.env.VITE_API_URL}/api/music/${roomId}/playlist.m3u8`;
  const initializeHls = (audio: HTMLMediaElement, streamUrl: string) => {
    destroyHls();
    const hls = new Hls(DEFAULT_STREAMING_CONFIG);
    hlsRef.current = hls;
    hls.loadSource(streamUrl);
    hls.attachMedia(audio);

    hls.on(Hls.Events.MANIFEST_PARSED, () => setIsLoaded(true));
    hls.on(Hls.Events.ERROR, (error) =>
      console.error('Streaming error:', error),
    );
  };

  const playStream = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (Hls.isSupported()) {
      initializeHls(audio, createStreamUrl(roomId));
    } else {
      console.error('HLS is not supported');
    }
  }, [roomId]);

  useEffect(() => {
    playStream();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setTimeout(() => {
        setIsLoaded(false);

        if (songIndex + 1 > totalSongs) {
          Promise.resolve().then(() => {
            setSongIndex(1);
            navigate('/');
            alert('모든 곡이 종료되었습니다.');
          });
          return;
        }

        setSongIndex((prev) => prev + 1);
        playStream();
      }, 0);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songIndex, totalSongs, navigate, playStream]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    audio.play().catch((error) => {
      if (error.name === 'NotAllowedError') {
        setIsLoaded(false);
      } else {
        throw error;
      }
    });
  }, [isLoaded]);

  return { audioRef, isLoaded, playStream };
};
