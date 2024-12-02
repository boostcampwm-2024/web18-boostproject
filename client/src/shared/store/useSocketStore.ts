import { create } from 'zustand';
import { createSocket } from '../api/socket';
import { useVoteStore } from './useVoteStore';
import { SocketActions, SocketState } from './state/socketState';
import { useChatMessageStore } from './useChatMessageStore';
import { setupSocketListeners } from './utils/socketEvents';

export const useSocketStore = create<SocketState & SocketActions>(
  (set, get) => ({
    socket: null,
    isConnected: false,
    roomId: null,
    userCount: 0,

    setConnectionStatus: (status: boolean) => set({ isConnected: status }),

    setUserCount: (count: number) => set({ userCount: count }),

    connect: (newRoomId: string) => {
      const { socket, roomId } = get();
      if (roomId === newRoomId && socket?.connected) return;

      if (socket) socket.disconnect();

      const newSocket = createSocket(newRoomId);
      setupSocketListeners(newSocket, {
        socketStore: get(),
        voteStore: useVoteStore.getState(),
        chatStore: useChatMessageStore.getState(),
      });

      newSocket.connect();
      set({ socket: newSocket, roomId: newRoomId });
    },

    disconnect: () => {
      const { socket } = get();
      if (socket) {
        socket.disconnect();
        set({ isConnected: false, socket: null, roomId: null });
      }
    },

    reset: () => {
      const { socket } = get();
      if (socket) socket.disconnect();
      set({ socket: null, isConnected: false, roomId: null });
    },
  }),
);
