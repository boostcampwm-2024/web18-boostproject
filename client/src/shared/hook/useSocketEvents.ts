import { Socket } from 'socket.io-client';
import { useCallback, useEffect } from 'react';

interface SocketEvents {
  [key: string]: (...args: any[]) => void;
}

interface UseSocketEventsProps {
  socket: Socket | null;
  events: SocketEvents;
}

export function useSocketEvents({ socket, events }: UseSocketEventsProps) {
  const registerEvents = useCallback(() => {
    Object.entries(events).forEach(([event, handler]) => {
      socket?.on(event, handler);
    });
  }, [socket, events]);

  const unregisterEvents = useCallback(() => {
    Object.entries(events).forEach(([event, handler]) => {
      socket?.off(event, handler);
    });
  }, [socket, events]);

  useEffect(() => {
    registerEvents();
    return () => {
      unregisterEvents();
    };
  }, [registerEvents, unregisterEvents]);
}
