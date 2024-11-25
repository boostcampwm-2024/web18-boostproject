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
      className={`absolute bottom-0 bg-grayscale-800 text-gray-100 w-full
      ${isOpen ? 'h-[40vh]' : 'h-14'} 
      transition-all duration-300 ease-in-out z-50
      rounded-t-lg`}
    >
      <SongDetailHeader
        category={category}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setCategory={setCategory}
      />
      {isOpen && (
        <SongDetailContent
          isOpen={isOpen}
          category={category}
          songs={songs}
          streamingIndex={streamingIndex}
        />
      )}
    </div>
  );
}
