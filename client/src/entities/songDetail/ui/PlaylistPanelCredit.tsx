import { SongData } from '@/entities/album/types';
import './PlaylistPanel.css';

interface PlaylistPanelCreditProps {
  currentSong: SongData;
}

function CreditListItem({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  return (
    <>
      <p className="text-sm mb-1">{title}</p>
      <p className="text-xs text-gray-400 mb-3">{content}</p>
    </>
  );
}

export function PlaylistPanelCredit({ currentSong }: PlaylistPanelCreditProps) {
  return (
    <div className="flex-[1] bg-grayscale-600 h-full w-full px-6 py-2 overflow-y-auto break-words credit-scrollbar">
      <p className="font-bold mb-3">크레딧</p>
      <CreditListItem title="연주자/가수" content={currentSong.instrument} />
      <CreditListItem
        title="작곡가/작사가"
        content={`${currentSong.composer}/${currentSong.writer}`}
      />
      <CreditListItem title="출처" content={currentSong.source} />
      {/* <p className="text-sm">프로듀서</p>
          <p className="text-xs text-gray-400">프로듀서</p> */}
    </div>
  );
}
