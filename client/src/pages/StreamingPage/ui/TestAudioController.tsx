import React, { useEffect, useState } from 'react';

interface TestAudioControllerProps {
  audioRef: React.RefObject<HTMLMediaElement>;
}

export const TestAudioController = ({ audioRef }: TestAudioControllerProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.controls = false;

    const updateProgress = () => {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      setProgress(progressPercent);
    };

    audio.addEventListener('timeupdate', updateProgress);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
    };
  }, []);

  return (
    <div className="w-full flex items-center space-x-2">
      <div className="flex-grow h-1 bg-grayscale-50 relative cursor-default">
        <div
          className={`absolute left-0 top-0 h-full bg-brand`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
