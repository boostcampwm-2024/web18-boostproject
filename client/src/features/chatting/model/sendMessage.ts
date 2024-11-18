import { socket } from '@/shared/api/socket';

export const sendMessage = (message: string, roomId: string) => {
  socket.emit(
    'message',
    { message: message, roomId: roomId },
    (response: any) => {
      console.log(response);
    },
  );
};
