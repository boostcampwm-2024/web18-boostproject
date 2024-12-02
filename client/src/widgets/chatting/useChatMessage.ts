import { useChatMessageStore } from '@/shared/store/useChatMessageStore';

export function useChatMessage() {
  const messages = useChatMessageStore((state) => state.messages);
  return { messages };
}
