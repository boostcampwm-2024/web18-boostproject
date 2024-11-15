import { useState, useEffect } from 'react';
import { socket } from '@/socket';
import { MessageData } from '@/entities/message/types';

export function useChatMessage() {
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    const handleBroadcast = (data: MessageData) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on('broadcast', handleBroadcast);

    return () => {
      socket.off('broadcast', handleBroadcast);
    };
  }, []);

  return { messages };
}
