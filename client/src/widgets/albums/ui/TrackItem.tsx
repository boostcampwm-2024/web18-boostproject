import { SongDetailData } from '@/entities/comment/types';
import { splitTime } from '@/shared/util/timeUtils';
interface TrackItemProps {
  trackData: SongDetailData;
  index: number;
}

export function TrackItem({ trackData, index }: TrackItemProps) {
  return (
    <section
      className={
        'flex w-full h-[30px] text-grayscale-50 justify-between mb-[24px]'
      }
    >
      <section className={'flex'}>
        <section className={'mr-8'}>{index + 1}.</section>
        <section>{trackData.songName}</section>
      </section>

      <section className={'text-grayscale-200 text-sm'}>
        {splitTime(trackData.songDuration)}
      </section>
    </section>
  );
}
