import './LyricsPanel.css';

interface LyricsPanelProps {
  lyrics: string;
}

export function LyricsPanel({ lyrics }: LyricsPanelProps) {
  const lyricsFormatted = lyrics
    .split('\n')
    .map((line, index) => <p key={index}>{line}</p>);
  return (
    <div className="lyrics text-center h-full overflow-y-auto px-6 py-4 ">
      {lyricsFormatted}
    </div>
  );
}
