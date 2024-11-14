import { MessageData } from '@/entities/message/types';
import { Message } from './Message';
import React from 'react';

interface MessageListProps {
  messages: MessageData[];
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="overflow-y-auto mb-3 mt-24">
      {messages.map((msg, index) => (
        <Message key={index} userName={msg.userName} message={msg.message} />
      ))}
    </div>
  );
}

export default React.memo(MessageList);
