import { MessageData } from '@/entities/message/types';

export interface ChatMessageState {
  messages: MessageData[];
  addMessage: (message: MessageData) => void;
  clearMessages: () => void;
}

export interface ChatActions {
  addMessage: (message: MessageData) => void;
  clearMessages: () => void;
}
