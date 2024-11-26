import { useCallback, useRef, useState, useEffect } from 'react';
import Hls from 'hls.js';
import { DEFAULT_STREAMING_CONFIG } from './constants';

export const useStreamingPlayer = (
  roomId: string,
  setSongIndex: (value: number) => void,
) => {
  const audioRef = useRef<HTMLMediaElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const createStreamUrl = (roomId: string) =>
    `${import.meta.env.VITE_API_URL}/api/music/${roomId}/playlist.m3u8?joinTimeStamp=1700000140000`;
  const initializeHls = (audio: HTMLMediaElement, streamUrl: string) => {
    const hls = new Hls(DEFAULT_STREAMING_CONFIG);
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

  return { audioRef, isLoaded, playStream };
};
