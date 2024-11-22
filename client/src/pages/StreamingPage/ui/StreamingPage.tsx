import { ChattingContainer } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { useStreamingRoom } from '@/shared/hook/useStreamingRoom';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';

export function StreamingPage() {
  // TODO: 연결 여부 전역 상태로 관리하기
  // TODO: 소켓 이벤트들 handler로 만들어서 한번에 관리하기
  // TODO: 방 입장과 퇴장 이벤트 따로 처리하기
  const { isConnected } = useStreamingRoom();

  if (!isConnected) {
    return <StreamingErrorPage />;
  }

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
