import { useState, useEffect, useCallback, useMemo } from 'react';

interface TimerProps {
  releaseDate: string;
  onCountdownComplete?: () => void;
  timerClassName?: string;
}

export function Timer({
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
    const updateTimer = () => {
      const newTime = calculateTimeRemaining();
      if (newTime) setTimeRemaining(newTime);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeRemaining]);

  const memoizedTimeRemaining = useMemo(() => timeRemaining, [timeRemaining]);

  return <p className={timerClassName}>{memoizedTimeRemaining}</p>;
}
