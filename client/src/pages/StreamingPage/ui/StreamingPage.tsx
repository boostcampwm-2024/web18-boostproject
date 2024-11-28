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

  if (!isConnected) {
    return <StreamingErrorPage />;
  }

  return (
    <div className="flex flex-row h-screen">
      {roomInfo && songIndex && (
        <Streaming
          roomInfo={roomInfo}
          songIndex={songIndex}
          setSongIndex={setSongIndex}
        />
      )}

      <div className="bg-grayscale-900 flex-shrink-0 w-[340px] text-grayscale-100 px-8 pt-10 pb-8 flex flex-col relative">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">채팅</div>
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-lg">{userCount}명</span>
          </div>
        </div>
        {roomInfo && <Vote songs={roomInfo.songResponseList} />}
        <ChattingContainer />
      </div>
    </div>
  );
}
