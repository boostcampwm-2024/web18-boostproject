import { create } from 'zustand';
import { ChatMessageState } from './state/chatState';

const INITIAL_STATE = {
  messages: [],
};

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  reset: () => set(INITIAL_STATE),
}));
