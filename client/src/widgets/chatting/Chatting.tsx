import ChatInput from '@/features/chatting/ChatInput';
import './Chatting.css';
import { Message } from '.';

export function Chatting() {
  return (
    <div className="flex flex-col flex-grow overflow-hidden">
      <div className="overflow-y-auto mb-3 mt-24">
        {Array.from({ length: 100 }).map((_, index) => (
          <Message key={index} />
        ))}
      </div>
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  );
}
