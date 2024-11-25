import { useRef, useEffect } from 'react';
import Hls from 'hls.js';

export function HlsTestPage() {
  const audioRef = useRef<HTMLMediaElement>(null);
  const albumId = 'RANDOM_AHH_ALBUM_ID';
  const joinTimeStamp = 1700000000000;
  const url = `/api/music/${albumId}/playlist.m3u8?joinTimeStamp=${joinTimeStamp}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    console.log(audio);
    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        xhrSetup: (xhr) => {
          xhr.withCredentials = true; // 필요한 경우
        },
      });

      hls.loadSource(url);
      hls.attachMedia(audio);

      // m3u8이 로드되고 발생되는 이벤트
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS Error:', data);
        console.log('Full m3u8 Link:', url);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <audio ref={audioRef} controls></audio>
    </div>
  );
}
