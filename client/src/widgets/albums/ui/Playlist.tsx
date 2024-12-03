import { TrackItem } from './TrackItem';
import './Scrollbar.css';
import { SongDetailData } from '@/entities/comment/types';
export interface PlaylistComponentProps {
  playlist: SongDetailData[];
}

export function Playlist({ playlist }: PlaylistComponentProps) {
  return (
    <article className={'w-full overflow-y-scroll h-96 pr-4 playlist'}>
      {playlist.map((item, index) => (
        <TrackItem trackData={item} index={index} key={index} />
      ))}
    </article>
  );
}
