import { useSocketStore } from '@/shared/store/useSocketStore';

export const sendMessage = (message: string, roomId: string) => {
  const { socket } = useSocketStore.getState();

  if (!socket || !socket.connected) {
    console.error('소켓 연결 안됨');
    return;
  }

  socket.emit(
    'message',
    { message: message, roomId: roomId },
    (response: any) => {
      console.log(response);
    },
  );
};
