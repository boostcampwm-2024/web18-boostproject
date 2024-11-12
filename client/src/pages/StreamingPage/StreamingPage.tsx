import { Chatting } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';

export function StreamingPage() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <Streaming />
      <div className="bg-grayscale-900 w-1/4 text-grayscale-100 px-8 py-10 flex flex-col relative">
        <div className="text-2xl font-bold mb-4">채팅</div>
        <Vote />
        <Chatting />
      </div>
    </div>
  );
}
