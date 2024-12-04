import React, { useState, useEffect, useCallback } from 'react';

interface TimerProps {
  releaseDate: string;
  onCountdownComplete?: () => void;
  timerClassName?: string;
}

export const Timer = React.memo(function Timer({
  releaseDate,
  onCountdownComplete,
  timerClassName = 'text-5xl font-bold mb-4',
}: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('00:00:00');

  const calculateTimeRemaining = useCallback(() => {
    const releaseTime = new Date(releaseDate).getTime();
    const now = new Date().getTime();
    const distance = releaseTime - now;

    if (distance < 0) {
      setTimeRemaining('00:00:00');
      onCountdownComplete?.();
      return null;
    }

    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, [releaseDate, onCountdownComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (releaseDate) {
      const updateTimer = () => {
        const newTime = calculateTimeRemaining();
        if (newTime) setTimeRemaining(newTime);
      };

      updateTimer();
      timer = setInterval(updateTimer, 1000);
    }

    return () => timer && clearInterval(timer);
  }, [calculateTimeRemaining, releaseDate]);

  return <p className={timerClassName}>{timeRemaining}</p>;
});
