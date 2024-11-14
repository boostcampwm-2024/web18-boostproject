import { io } from 'socket.io-client';

const URL = 'http://localhost:3000/rooms';

export const socket = io(URL, {
  // autoConnect: false,
  transports: ['websocket'],
});
