import { Chatting } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';

export function StreamingPage() {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="bg-gray-400 w-3/4">스트리밍 중이지렁이</div>
      <div className="bg-gray-900 w-1/4 text-gray-100 px-8 py-10 flex flex-col relative">
        <div className="text-2xl font-bold mb-4">채팅</div>
        <Vote />
        <Chatting />
      </div>
    </div>
  );
}
