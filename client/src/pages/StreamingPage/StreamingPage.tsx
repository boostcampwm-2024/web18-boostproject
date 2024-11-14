import { Chatting } from '@/widgets/chatting';
import { Vote } from '@/widgets/vote';
import { Streaming } from '@/widgets/streaming';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '@/socket';

export function StreamingPage() {
  const [isConnected, setIsConnected] = useState(false);
  const pathname = useParams().roomId;

  useEffect(() => {
    console.log('엥?');
    // 소켓 연결
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('connected');
    });

    //소켓 연결 해제
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    socket.on('joinedRoom', (data) => {
      console.log('joinedRoom', data);
    });

    socket.emit(
      'joinRoom',
      { roomId: pathname, userId: 'abcd' },
      (response: any) => {
        console.log(response);
      },
    );

    return () => {
      socket.off('disconnect');
      socket.off('connect');
    };
  }, []);

  return (
    <div className="flex flex-row h-screen">
      <Streaming />
      <div className="bg-grayscale-900 w-1/4 text-grayscale-100 px-8 pt-10 pb-8 flex flex-col relative">
        <div className="text-2xl font-bold mb-4">채팅</div>
        <Vote />
        <Chatting />
      </div>
    </div>
  );
}
