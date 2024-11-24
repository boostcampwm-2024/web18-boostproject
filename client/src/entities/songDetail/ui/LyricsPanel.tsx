interface LyricsPanelProps {
  lyrics: string;
}

export function LyricsPanel({ lyrics }: LyricsPanelProps) {
  const lyricsFormatted = lyrics
    .split('\n')
    .map((line, index) => <p key={index}>{line}</p>);
  return (
    <div className="lyrics text-center h-full overflow-y-auto">
      {lyricsFormatted}
    </div>
  );
}
