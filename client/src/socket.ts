import { io } from 'socket.io-client';

export const socket = io('/rooms', {
  autoConnect: false,
});
