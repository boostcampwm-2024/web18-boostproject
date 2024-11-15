import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '@/socket';
import { useSocketEvents } from './useSocketEvents';

export function useStreamingRoom() {
  const [isConnected, setIsConnected] = useState(false);
  const { roomId } = useParams();

  const handleConnect = () => {
    setIsConnected(true);

    if (roomId) {
      socket.emit('joinRoom', { roomId, userId: 'test' }, (response: any) => {
        console.log('방 입장 응답 : ', response);
      });
    }
  };

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
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  useSocketEvents({
    socket,
    events: {
      connect: handleConnect,
      disconnect: handleDisconnect,
      connect_error: handleConnectError,
      joinedRoom: handleJoinRoom,
    },
  });

  return { isConnected };
}
