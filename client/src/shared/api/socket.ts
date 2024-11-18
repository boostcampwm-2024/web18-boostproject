import { io } from 'socket.io-client';

const URL = '/rooms';

export const socket = io(URL, {
  autoConnect: false,
});
