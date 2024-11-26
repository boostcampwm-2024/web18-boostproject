import { create } from 'zustand';
import { MessageData } from '@/entities/message/types';

interface ChatMessageState {
  messages: MessageData[];
  addMessage: (message: MessageData) => void;
  clearMessages: () => void;
}

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));
