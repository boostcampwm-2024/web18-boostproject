import ChatInput from '@/features/chatting/ChatInput';
import './Chatting.css';
import { Message } from './Message';
import { useEffect, useState } from 'react';
import { socket } from '@/socket';

interface MessageData {
  userName: string;
  message: string;
}

export function Chatting() {
  const [chatList, setChatList] = useState<MessageData[]>([]);

  useEffect(() => {
    socket.on('broadcast', (data) => {
      console.log('broadcast', data);
      setChatList((prev) => [...prev, data]);
    });
  }, []);

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="overflow-y-auto mb-3 mt-24">
        {chatList.map((chat, index) => (
          <Message
            key={index}
            userName={chat.userName}
            message={chat.message}
          />
        ))}
      </div>
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  );
}
