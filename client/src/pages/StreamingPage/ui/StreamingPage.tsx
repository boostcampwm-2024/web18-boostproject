import { ChattingContainer } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { useChatMessageStore } from '@/shared/store/useChatMessageStore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicAPI } from '@/shared/api/publicAPI';
import { Person } from '@/shared/icon/Person';
import { NetworkBoundary } from '@/NetworkBoundary';
import { useQuery } from '@tanstack/react-query';

function StreamingContainer() {
  const { roomId } = useParams<{ roomId: string }>();
  const [songIndex, setSongIndex] = useState<number>(0);

  const {
    data: roomInfo,
    error,
    isError,
  } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => publicAPI.getRoomInfo(roomId!),
  });

  useEffect(() => {
    if (roomInfo) {
      setSongIndex(Number(roomInfo.trackOrder));
    }
  }, [roomInfo]);

  if (isError) {
    throw error;
  }

  if (!roomInfo) {
    return null;
  }

  return (
    <div className="w-full">
      <Streaming
        roomInfo={roomInfo}
        songIndex={songIndex}
        setSongIndex={setSongIndex}
      />
      {roomInfo && <Vote songs={roomInfo.songResponseList} />}
    </div>
  );
}

export function StreamingPage() {
  const { isConnected, connect, reset, userCount } = useSocketStore();
  const { clearMessages } = useChatMessageStore();
  const { roomId } = useParams<{ roomId: string }>();

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

  return (
    <div className="flex flex-row h-screen">
      <div className="flex-grow min-w-[calc(100%-340px)]">
        <NetworkBoundary key={roomId}>
          <StreamingContainer />
        </NetworkBoundary>
      </div>
      <div className="h-screen bg-grayscale-900 flex-shrink-0 w-[340px] text-grayscale-100 px-8 pt-10 pb-8 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">채팅</div>
          <div className="flex items-center gap-2">
            <Person />
            <span className="text-lg">{userCount}명</span>
          </div>
        </div>
        <ChattingContainer />
      </div>
    </div>
  );
}
