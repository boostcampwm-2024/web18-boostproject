import { io } from 'socket.io-client';

const URL = 'http://localhost:3000/rooms';

export const socket = io(URL, {
  autoConnect: false,
  query: {
    roomId: 'RANDOM_AHH_ALBUM_ID', // 실제 roomId로 교체
  },
});
