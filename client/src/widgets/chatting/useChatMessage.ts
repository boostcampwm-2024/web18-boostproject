import { MessageData } from '@/entities/message/types';
import { useSocketStore } from '@/shared/store/useSocketStore';
import { useEffect } from 'react';
import { useChatMessageStore } from '@/shared/store/useChatMessageStore';

export function useChatMessage() {
  const { messages, addMessage } = useChatMessageStore();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) return;

    const handleBroadcast = (data: MessageData) => {
      addMessage(data);
    };

    socket.on('broadcast', handleBroadcast);

    return () => {
      socket.off('broadcast', handleBroadcast);
    };
  }, [socket, addMessage]);

  return { messages };
}
