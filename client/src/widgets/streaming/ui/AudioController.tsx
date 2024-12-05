import React, { useEffect, useState } from 'react';

interface AudioControllerProps {
  audioRef: React.RefObject<HTMLMediaElement>;
  songDuration: number;
}

export const AudioController = ({
  audioRef,
  songDuration,
}: AudioControllerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setProgress(0);
    const updateProgress = () => {
      const progressPercent =
        ((songDuration - audio.duration + audio.currentTime) / songDuration) *
        100;
      setProgress(progressPercent);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, [songDuration]);

  return (
    <div className="absolute bottom-0 z-40 w-full flex items-center space-x-2">
      <div className="flex-grow h-1 relative cursor-default">
        <div className={`h-full bg-brand`} style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};
