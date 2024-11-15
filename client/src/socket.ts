import { io } from 'socket.io-client';

const URL = 'http://inear.live/rooms';

export const socket = io(URL, {
  autoConnect: false
});
