import { ChatInput } from '@/features/chatting';
import { useChatMessage } from './useChatMessage';
import MessageList from './MessageList';

export function ChattingContainer() {
  const { messages } = useChatMessage();

  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <MessageList messages={messages} />
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  );
}
