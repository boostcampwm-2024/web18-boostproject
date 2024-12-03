interface AlbumArtistProps {
  artist: string;
  songLength: number;
  totalDuration: number;
}

export function AlbumArtist({
  artist,
  songLength,
  totalDuration,
}: AlbumArtistProps) {
  const hour = Math.floor(Number(totalDuration) / 3600);
  const minute = Math.floor((Number(totalDuration) % 3600) / 60);
  const second = Math.floor(Number(totalDuration) % 60);

  return (
    <p
      className={
        'text-lg text-grayscale-400 mt-4 flex justify-start overflow-visible whitespace-nowrap absolute max-w-[calc(100vw-340px)]'
      }
    >
      <span className={'truncate'}>{artist}</span>
      <p className={'flex-shrink-0 flex-grow-0 whitespace-nowrap'}>
        <span className={'mx-2'}>•</span>
        <span>{songLength}곡</span>
      </p>
      <p className={'flex-shrink-0 flex-grow-0 whitespace-nowrap'}>
        <span className={'mx-2'}>•</span>
        <span>
          {(hour > 0 ? String(hour).padStart(2, '0') + '시간 ' : '') +
            String(minute).padStart(2, '0') +
            '분 ' +
            String(second).padStart(2, '0') +
            '초'}
        </span>
      </p>
    </p>
  );
}
