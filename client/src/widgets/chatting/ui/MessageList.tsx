import { MessageData } from '@/entities/message/types';
import { Message } from './Message';
import './Chatting.css';
import React, { useEffect } from 'react';

interface MessageListProps {
  messages: MessageData[];
}

function MessageList({ messages }: MessageListProps) {
  const messageEndRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messageEndRef.current) return;
    messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="chatting overflow-y-auto mb-3 mt-24">
      {messages.map((msg, index) => (
        <Message
          key={index}
          userName={msg.userName}
          userId={msg.userId}
          message={msg.message}
        />
      ))}
      <div ref={messageEndRef}></div>
    </div>
  );
}

export default React.memo(MessageList);
