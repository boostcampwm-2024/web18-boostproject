import { TrackItem } from '@/widgets/albums';

export interface PlaylistComponentProps {
  playlist: { songName: string; songDuration: string }[];
}

export function Playlist({ playlist }: PlaylistComponentProps) {
  return (
    <article className={'w-full overflow-y-scroll h-[390px]'}>
      {playlist.map(
        (item: { songName: string; songDuration: string }, index) => (
          <TrackItem trackData={item} index={index} key={index} />
        ),
      )}
    </article>
  );
}
