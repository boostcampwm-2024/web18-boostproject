import { ChevronDown } from '@/shared/icon/ChevronDown';
import { useState } from 'react';
import { useSocketStore } from '@/shared/store/useSocketStore.ts';
import { SongData } from '@/entities/album/types.ts';
import { useVote } from '@/widgets/vote/useVote.ts';
import './ScrollBar.css';

export function Vote({ songs }: { songs: SongData[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { voteData } = useVote();
  const { socket } = useSocketStore();

  const handleVoteClick = (trackNumber: string) => {
    if (!socket) return;
    socket.emit('vote', { trackNumber });
  };

  return (
    <div className="absolute top-[5.5rem] left-0 right-0 bg-grayscale-700  z-10 mx-8 rounded-lg">
      <div
        className="flex flex-row items-center justify-between px-5 py-3 rounded-lg cursor-pointer hover:bg-grayscale-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-2">
          <p className="text-grayscale-300">최애의 트랙</p>
          <p className="text-lg font-semibold">내 취향 음악은?</p>
        </div>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDown />
        </div>
      </div>
      <div
        className={`overflow-y-scroll transition-all duration-200 ${isOpen ? 'max-h-40' : 'max-h-0'} px-4`}
      >
        {Object.values(voteData).map((item, index) => (
          <div className="vote relative h-full my-3 flex w-full justify-between overflow-x-hidden hover:bg-grayscale-600 rounded-lg cursor-pointer">
            <div>
              <div
                className={`votebg absolute bg-grayscale-800 text-grayscale-300 text-shadow h-full rounded-md z-0`}
                style={{ width: `${item}` }}
              ></div>
              <p
                key={index}
                className={`relative mb-1 cursor-pointer px-3 py-3 rounded-md z-10`}
                onClick={() => handleVoteClick(String(index + 1))}
              >
                {songs[index].title}
              </p>
            </div>
            <div className={'w-10 w-20'}>
              <p
                key={index}
                className={`mb-1 cursor-pointer px-3 py-3 rounded-md z-10`}
                onClick={() => handleVoteClick(String(index + 1))}
              >
                {item}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
