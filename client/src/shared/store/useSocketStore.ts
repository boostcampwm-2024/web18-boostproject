import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { createSocket } from '../api/socket';
import { useVoteStore } from './useVoteStore';

interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  roomId: string | null;
  userCount: number;
  connect: (roomId: string) => void;
  disconnect: () => void;
  reset: () => void;
  setUserCount: (count: number) => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  roomId: null,
  userCount: 0,

  connect: (newRoomId: string) => {
    const { socket, roomId } = get();

    // 이미 같은 방에 연결되어 있다면 무시
    if (roomId === newRoomId && socket?.connected) return;

    // 기존 소켓 연결 해제
    if (socket) {
      socket.disconnect();
    }

    const newSocket = createSocket(newRoomId);
    const voteStore = useVoteStore.getState();

    newSocket.on('connect', () =>
      set({
        isConnected: true,
        socket: newSocket,
        roomId: newRoomId,
      }),
    );

    newSocket.on('disconnect', () =>
      set({
        isConnected: false,
        socket: null,
        roomId: null,
      }),
    );

    newSocket.on('voteShow', (data) => {
      voteStore.showVote(data);
    });

    newSocket.on(
      'roomUsersUpdated',
      (data: { roomId: string; userCount: number }) => {
        set({ userCount: data.userCount });
      },
    );

    newSocket.connect();
  },

  setUserCount: (count: number) => set({ userCount: count }),

  disconnect: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ isConnected: false, socket: null, roomId: null });
    }
  },

  reset: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ socket: null, isConnected: false, roomId: null });
  },
}));
