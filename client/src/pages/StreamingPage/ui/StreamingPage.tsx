import { ChattingContainer } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { useChatMessageStore } from '@/shared/store/useChatMessageStore';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function StreamingPage() {
  const { roomId } = useParams();
  const { isConnected, connect, reset } = useSocketStore();
  const { clearMessages } = useChatMessageStore();
  useEffect(() => {
    // 페이지 진입 시 소켓 초기화
    reset();
    clearMessages();
    if (roomId) {
      connect(roomId);
    }

    // 페이지 벗어날 때 소켓 리셋
    return () => {
      reset();
    };
  }, [roomId]);

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
