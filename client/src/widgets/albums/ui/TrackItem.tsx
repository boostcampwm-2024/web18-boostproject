interface TrackItemProps {
  trackData: { songName: string; songDuration: string };
}

export function TrackItem({ trackData }: TrackItemProps) {
  const hour = Math.floor(Number(trackData.songDuration) / 3600);
  const minute = Math.floor((Number(trackData.songDuration) % 3600) / 3600);
  const second = Math.floor(Number(trackData.songDuration) % 60);

  return (
    <section
      className={'flex w-full h-4 text-grayscale-50 justify-between mb-8'}
    >
      <section>{trackData.songName}</section>
      <section className={'text-grayscale-200 text-sm'}>
        {(hour > 0 ? String(hour).padStart(2, '0') + ':' : '') +
          String(minute).padStart(2, '0') +
          ':' +
          String(second).padStart(2, '0')}
      </section>
    </section>
  );
}
