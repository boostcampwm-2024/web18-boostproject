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

    resetAllStores: () => {
      useVoteStore.getState().reset();
      useChatMessageStore.getState().reset();
    },

    connect: (newRoomId: string) => {
      const { socket, roomId } = get();
      if (roomId === newRoomId && socket?.connected) return;
      console.log('NEW ROOM CONNECTED');

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
      console.log('DISCONNECTED');
      const { socket } = get();
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        get().resetAllStores();
        set({ isConnected: false, socket: null, roomId: null });
      }
    },

    reset: () => {
      console.log('RECONNECTED');
      const { socket } = get();
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        get().resetAllStores();
      }
      set({ socket: null, isConnected: false, roomId: null });
    },
  }),
);
