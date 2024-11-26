import { SongData } from '@/entities/album/types';
import { CATEGORIES } from '../model/types';
import { LyricsPanel } from '@/entities/songDetail';
import { PlaylistPanel } from '@/entities/songDetail';

interface SongDetailContentProps {
  isOpen: boolean;
  category: string;
  songs: SongData[];
  songIndex: number;
}

export function SongDetailContent({
  isOpen,
  category,
  songs,
  songIndex,
}: SongDetailContentProps) {
  return (
    <div
      className={`transition-opacity duration-200 ease-in-out overflow-hidden
    ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      {category === CATEGORIES.LYRICS ? (
        <LyricsPanel lyrics={songs[songIndex - 1].lyrics} />
      ) : (
        <PlaylistPanel songs={songs} songIndex={songIndex} />
      )}
    </div>
  );
}
