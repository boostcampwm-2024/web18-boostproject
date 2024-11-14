import { ChattingContainer } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { useStreamingRoom } from './useStreamingRoom';

export function StreamingPage() {
  // TODO: 연결 여부 전역 상태로 관리하기
  const { isConnected } = useStreamingRoom();

  return (
    <div className="flex flex-row h-screen">
      <Streaming />
      <div className="bg-grayscale-900 w-1/4 text-grayscale-100 px-8 pt-10 pb-8 flex flex-col relative">
        <div className="text-2xl font-bold mb-4">채팅</div>
        <Vote />
        <ChattingContainer />
      </div>
    </div>
  );
}
