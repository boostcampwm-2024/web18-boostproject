import { useState } from 'react';
import { SongData } from '@/entities/album/types';
import { SongDetailHeader } from './SongDetailHeader';
import { SongDetailContent } from './SongDetailContent';

interface SongDetailProps {
  songs: SongData[];
  streamingIndex: number;
}

export function SongDetail({ songs, streamingIndex }: SongDetailProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('lyrics');

  return (
    <div
      className={`absolute bottom-0 w-full bg-grayscale-800 text-gray-100 rounded-t-lg 
      transform transition-transform duration-300 ease-in-out z-50
      ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}`}
    >
      <SongDetailHeader
        category={category}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCategory={setCategory}
      />
      <SongDetailContent
        isOpen={isOpen}
        category={category}
        songs={songs}
        streamingIndex={streamingIndex}
      />
    </div>
  );
}
