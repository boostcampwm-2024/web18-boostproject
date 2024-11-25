import { SongData } from '@/entities/album/types';
import { CATEGORIES } from '../model/types';
import { LyricsPanel } from '@/entities/songDetail';
import { PlaylistPanel } from '@/entities/songDetail';

interface SongDetailContentProps {
  isOpen: boolean;
  category: string;
  songs: SongData[];
  streamingIndex: number;
}

export function SongDetailContent({
  isOpen,
  category,
  songs,
  streamingIndex,
}: SongDetailContentProps) {
  return (
    <div
      className={`px-6 py-4 h-64 transition-opacity duration-200 ease-in-out
    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {category === CATEGORIES.LYRICS ? (
        <LyricsPanel lyrics={songs[streamingIndex - 1].lyrics} />
      ) : (
        <PlaylistPanel />
      )}
    </div>
  );
}
