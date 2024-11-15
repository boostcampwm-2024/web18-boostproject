import { io } from 'socket.io-client';

const URL = 'https://inear.live/rooms';

export const socket = io(URL, {
  autoConnect: false
});
