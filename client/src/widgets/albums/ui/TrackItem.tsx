interface TrackItemProps {
  trackData: { songName: string; songDuration: string };
  index: number;
}

export function TrackItem({ trackData, index }: TrackItemProps) {
  const hour = Math.floor(Number(trackData.songDuration) / 3600);
  const minute = Math.floor((Number(trackData.songDuration) % 3600) / 3600);
  const second = Math.floor(Number(trackData.songDuration) % 60);

  return (
    <section
      className={
        'flex w-full h-[30px] text-grayscale-50 justify-between mb-[24px]'
      }
    >
      <section className={'flex'}>
        <section className={'mr-8'}>{index + 1}</section>
        <section>{trackData.songName}</section>
      </section>

      <section className={'text-grayscale-200 text-sm'}>
        {(hour > 0 ? String(hour).padStart(2, '0') + ':' : '') +
          String(minute).padStart(2, '0') +
          ':' +
          String(second).padStart(2, '0')}
      </section>
    </section>
  );
}
