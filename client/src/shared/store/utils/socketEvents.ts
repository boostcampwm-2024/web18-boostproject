import { Socket } from 'socket.io-client';
import { ChatActions } from '../state/chatState';
import { SocketActions } from '../state/socketState';
import { VoteActions, VoteType } from '../state/voteState';
import { MessageData } from '@/entities/message/types';

interface Stores {
  socketStore: SocketActions;
  voteStore: VoteActions;
  chatStore: ChatActions;
}

export const setupSocketListeners = (socket: Socket, stores: Stores) => {
  socket.on('connect', () => {
    stores.socketStore.setConnectionStatus(true);
  });

  socket.on('disconnect', () => {
    stores.socketStore.setConnectionStatus(false);
  });

  socket.on('voteShow', (data: VoteType) => {
    stores.voteStore.showVote(data);
  });

  socket.on('voteUpdated', (data: VoteType) => {
    stores.voteStore.updateVote(data);
  });

  socket.on(
    'roomUsersUpdated',
    (data: { roomId: string; userCount: number }) => {
      stores.socketStore.setUserCount(data.userCount);
    },
  );

  socket.on('broadcast', (data: MessageData) => {
    stores.chatStore.addMessage(data);
  });
};
