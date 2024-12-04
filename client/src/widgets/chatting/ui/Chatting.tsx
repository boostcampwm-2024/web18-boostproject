import React from 'react';
import { ChattingContainer } from './ChattingContainer';
import { UserCounter } from '@/features/useCounter/ui/UserCounter';

export const Chatting = React.memo(function ChatSection() {
  return (
    <div className="h-screen bg-grayscale-900 flex-shrink-0 w-[340px] text-grayscale-100 px-8 pt-10 pb-10 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">채팅</div>
        <UserCounter />
      </div>
      <ChattingContainer />
    </div>
  );
});
