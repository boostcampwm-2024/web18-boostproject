import { MessageData } from '@/entities/message/types';

export interface ChatMessageState {
  messages: MessageData[];
  addMessage: (message: MessageData) => void;
  clearMessages: () => void;
  reset: () => void;
}

export interface ChatActions {
  addMessage: (message: MessageData) => void;
  clearMessages: () => void;
  reset: () => void;
}
