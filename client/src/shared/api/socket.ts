import { io, Socket } from 'socket.io-client';

export const createSocket = (roomId: string): Socket => {
  const URL = `${import.meta.env.VITE_API_URL}/rooms`;
  console.log(URL);
  return io(URL, {
    autoConnect: false,
    reconnectionAttempts: 3,
    query: {
      roomId,
    },
  });
};
