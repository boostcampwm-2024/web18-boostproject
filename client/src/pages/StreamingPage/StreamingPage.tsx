import { Chatting } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import SampleAlbumCover from '@/assets/sample-album-cover-1.png';

export function StreamingPage() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="bg-grayscale-400 w-3/4 relative overflow-hidden">
        <img
          src={SampleAlbumCover}
          className="absolute inset-0 w-full h-full object-cover scale-150 blur-md"
          alt="Album Cover"
        />
        <div className="bg-black opacity-45 w-full h-full"></div>
      </div>
      <div className="bg-grayscale-900 w-1/4 text-grayscale-100 px-8 py-10 flex flex-col relative">
        <div className="text-2xl font-bold mb-4">채팅</div>
        <Vote />
        <Chatting />
      </div>
    </div>
  );
}
