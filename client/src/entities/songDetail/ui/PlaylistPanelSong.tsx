import Lottie from 'lottie-react';
import musicAnimation from '@/shared/lottie/music.json';
import { SongData } from '@/entities/album/types';
import './PlaylistPanel.css';
interface PlaylistPanelSongProps {
  songs: SongData[];
  songIndex: number;
}

export function PlaylistPanelSong({
  songs,
  songIndex,
}: PlaylistPanelSongProps) {
  const formattedDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="flex-[2] overflow-y-auto break-words playlist-scrollbar">
      {songs.map((song, index) => (
        <div
          key={song.id}
          className={`flex items-center justify-between px-6 py-2 
            ${songIndex - 1 === index ? `bg-grayscale-600` : ``}`}
        >
          {songIndex - 1 === index ? (
            <Lottie
              animationData={musicAnimation}
              style={{ width: 14, height: 14 }}
            />
          ) : (
            <p>{index + 1}</p>
          )}
          <p className={`${songIndex - 1 === index ? `text-brand` : ``}`}>
            {song.title}
          </p>
          <p className="text-grayscale-400 text-sm">
            {formattedDuration(Number(song.duration))}
          </p>
        </div>
      ))}
    </div>
  );
}
