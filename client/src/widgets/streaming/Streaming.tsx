import { AlbumBackground } from './AlbumBackground';
import { AlbumInfo } from './AlbumInfo';
import { Album } from '@/entities/album/type';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';

const SAMPLE_ALBUM: Album = {
  coverImage: SampleAlbumCover,
  tags: ['밴드', '국내'],
  title: '코난못난코코난못난코코난못난코코난못난코',
  artist: 'TOUCHED',
  currentTime: '00:00',
  trackName: '불시',
};

export function Streaming() {
  return (
    <div className="bg-grayscale-400 w-3/4 relative overflow-hidden">
      <AlbumBackground coverImage={SAMPLE_ALBUM.coverImage} />
      <div className="absolute inset-0 flex justify-center pt-28 text-grayscale-100 z-10">
        <AlbumInfo album={SAMPLE_ALBUM} />
      </div>
    </div>
  );
}
