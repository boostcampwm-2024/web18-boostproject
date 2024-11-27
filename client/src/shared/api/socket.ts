import { io, Socket } from 'socket.io-client';

export const createSocket = (roomId: string): Socket => {
  const URL = `http://localhost:3000/rooms`;
  console.log(URL);
  return io(URL, {
    autoConnect: false,
    reconnectionAttempts: 3,
    query: {
      roomId,
    },
  });
};
