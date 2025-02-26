import { AlbumData } from '@/entities/album/types';
import { convertToKTC, splitDate } from '@/shared/util/timeUtils';
import { Timer } from '@/shared/ui';
import { Notice } from '@/pages/StreamingPage/ui/Notice';

export function Standby({ album }: { album: AlbumData }) {
  const handleCountdownComplete = () => {
    window.location.reload();
  };

  return (
    <div className="text-grayscale-100 flex flex-col h-full w-full justify-center items-center">
      <p className="text-2xl font-bold">{album.title}</p>
      <p className="mb-4">{album.artist}</p>
      <Timer
        releaseDate={album.releaseDate}
        onCountdownComplete={handleCountdownComplete}
      />
      <p className="text-grayscale-300">
        {splitDate(convertToKTC(album.releaseDate))} 시작 예정
      </p>
      <Notice message={'자유롭게 의견을 나눠보세요'} title={album.title} />
    </div>
  );
}
