import { ChattingContainer } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { StreamingErrorPage } from '@/pages/StreamingErrorPage';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { useChatMessageStore } from '@/shared/store/useChatMessageStore';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { RoomResponse } from '@/entities/album/types';
import { publicAPI } from '@/shared/api/publicAPI';
import { Person } from '@/shared/icon/Person';

export function StreamingPage() {
  const { isConnected, connect, reset, userCount } = useSocketStore();
  const { clearMessages } = useChatMessageStore();
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomResponse | null>(null);
  const [songIndex, setSongIndex] = useState<number>(0);

  const getRoomInfo = async (roomId: string) => {
    const res: RoomResponse = await publicAPI
      .getRoomInfo(roomId)
      .then((res) => res)
      .catch((err) => console.log(err));
    setRoomInfo(res);
    setSongIndex(Number(res.trackOrder));
  };

  useEffect(() => {
    // 페이지 진입 시 소켓 초기화
    reset();
    clearMessages();

    if (roomId) {
      getRoomInfo(roomId);
      connect(roomId);
    }

    // 페이지 벗어날 때 소켓 리셋
    return () => {
      reset();
    };
  }, [roomId]);

  // if (!isConnected) {
  //   return (
  //     <StreamingErrorPage message={'시스템 오류로 방에 입장할 수 없습니다'} />
  //   );
  // }

  return (
    <div className="flex flex-row h-screen">
      {roomInfo && songIndex ? (
        <Streaming
          roomInfo={roomInfo}
          songIndex={songIndex}
          setSongIndex={setSongIndex}
        />
      ) : (
        <StreamingErrorPage
          message={'존재하지 않거나 이미 스트리밍이 종료된 방입니다'}
        />
      )}
      <div className="bg-grayscale-900 flex-shrink-0 w-[340px] text-grayscale-100 px-8 pt-10 pb-8 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">채팅</div>
          <div className="flex items-center gap-2">
            <Person />
            <span className="text-lg">{userCount}명</span>
          </div>
        </div>
        {roomInfo && <Vote songs={roomInfo.songResponseList} />}
        <ChattingContainer />
      </div>
    </div>
  );
}
