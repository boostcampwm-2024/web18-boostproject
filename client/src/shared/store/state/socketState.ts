import { Socket } from 'socket.io-client';

export interface SocketState {
  socket: Socket | null;
  isConnected: boolean;
  roomId: string | null;
  userCount: number;
}

export interface SocketActions {
  connect: (roomId: string) => void;
  disconnect: () => void;
  reset: () => void;
  setUserCount: (count: number) => void;
  setConnectionStatus: (status: boolean) => void;
  resetAllStores: () => void;
}
