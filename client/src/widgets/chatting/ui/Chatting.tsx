import React from 'react';
import { ChattingContainer } from './ChattingContainer';
import { useSocketStore } from '@/shared/store/useSocketStore';
import Person from '@/shared/icon/Person';

export const Chatting = React.memo(function ChatSection() {
  const userCount = useSocketStore((state) => state.userCount);

  return (
    <div className="h-screen bg-grayscale-900 flex-shrink-0 w-[340px] text-grayscale-100 px-8 pt-10 pb-10 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">채팅</div>
        <div className="flex items-center gap-2">
          <Person />
          <span className="text-lg">{userCount}명</span>
        </div>
      </div>
      <ChattingContainer />
    </div>
  );
});
