import { io } from 'socket.io-client';
const URL = import.meta.env.VITE_BASE_URL + '/rooms';

export const socket = (roomId: string) => {
  return io(URL, {
    autoConnect: false,
    query: {
      roomId,
    },
  });
};
