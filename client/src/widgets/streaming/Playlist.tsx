import { playListData } from './PlaylistMock';
interface playTrack {
  id: number;
  title: string;
  time: string;
  artist: string;
  composer?: string;
  Lyricist?: string;
  producer?: string;
  reference?: string;
}
export function Playlist() {
  return (
    <div>
      <ul>
        {playListData.map((track: playTrack) => (
          <li key={track.id}>
            <p>{track.title}</p>
            <p>{track.time}</p>
            <p>{track.artist}</p>
            <p>{track.composer}</p>
            <p>{track.Lyricist}</p>
            <p>{track.producer}</p>
            <p>{track.reference}</p>
          </li>
        ))}
      </ul>
      <div></div>
    </div>
  );
}
