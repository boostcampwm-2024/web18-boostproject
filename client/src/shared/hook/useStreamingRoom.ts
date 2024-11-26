import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocketEvents } from './useSocketEvents';
import { Socket } from 'socket.io-client';
import { createSocket } from '../api/socket';

export function useStreamingRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams();

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const handleJoinRoom = (data: any) => {
    console.log('방 입장 : ', data);
  };

  const handleConnectError = (err: Error) => {
    setIsConnected(false);
    console.log(`연결 오류 : ${err.message}`);
  };

  useEffect(() => {
    if (!roomId) return;
    const newSocket = createSocket(roomId);

    if (!newSocket.connected) {
      newSocket.connect();
    }
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useSocketEvents({
    socket,
    events: {
      disconnect: handleDisconnect,
      connect_error: handleConnectError,
      joinedRoom: handleJoinRoom,
    },
  });

  return { isConnected, socket };
}
