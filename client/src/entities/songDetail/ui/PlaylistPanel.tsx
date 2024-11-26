import { SongData } from '@/entities/album/types';
import { PlaylistPanelSong } from './PlaylistPanelSong';
import { PlaylistPanelCredit } from './PlaylistPanelCredit';
interface PlaylistPanelProps {
  songs: SongData[];
  songIndex: number;
}

export function PlaylistPanel({ songs, songIndex }: PlaylistPanelProps) {
  return (
    <div className="flex flex-row h-full">
      <PlaylistPanelSong songs={songs} songIndex={songIndex} />
      <PlaylistPanelCredit currentSong={songs[songIndex - 1]} />
    </div>
  );
}
