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
import { Standby } from './Standby';
import { compareDate, sumSeconds } from '@/shared/util/timeUtils';

function validateRoom(roomInfo: any) {
  return (
    compareDate(
      sumSeconds(
        roomInfo.albumResponse.releaseDate,
        Number(roomInfo.totalDuration),
      ),
      new Date(),
    ) > 0
  );
}

function StreamingContainer() {
  const { roomId } = useParams<{ roomId: string }>();
  const [songIndex, setSongIndex] = useState<number>(1);
  const { data: roomInfo } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => publicAPI.getRoomInfo(roomId!),
    throwOnError: true,
  });

  useEffect(() => {
    if (roomInfo) {
      setSongIndex(Number(roomInfo.trackOrder));
    }
  }, [roomInfo]);
  console.log(roomInfo);

  // 방 정보가 없을 때
  if (!roomInfo) {
    return null;
  }

  // 종료된 방일 때
  if (!validateRoom(roomInfo)) {
    throw new Error('방이 종료되었습니다.');
  }
  // 아직 세션이 시작되지 않음

  if (roomInfo.trackOrder === null) {
    return <Standby album={roomInfo.albumResponse} />;
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
