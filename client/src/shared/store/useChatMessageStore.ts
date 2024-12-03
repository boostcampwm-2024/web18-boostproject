import { create } from 'zustand';
import { ChatMessageState } from './state/chatState';
const MAX_MESSAGE_LENGTH = 150;
const INITIAL_STATE = {
  messages: [],
};

export const useChatMessageStore = create<ChatMessageState>((set) => ({
  messages: [],

  addMessage: (message) =>
    set((state) => {
      const updatedMessages =
        state.messages.length >= MAX_MESSAGE_LENGTH
          ? [...state.messages.slice(1), message]
          : [...state.messages, message];
      return { messages: updatedMessages };
    }),

  clearMessages: () => set({ messages: [] }),
  reset: () => set(INITIAL_STATE),
}));
