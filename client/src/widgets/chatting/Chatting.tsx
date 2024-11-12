import ChatInput from '@/features/chatting/ChatInput';
import './Chatting.css';

export function Chatting() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto mb-5 pt-24">
        {Array.from({ length: 100 }).map((_, index) => (
          <div key={index} className="text-sm pb-4">
            <span className="text-brand mr-4">코난못난코</span>
            <span>{`안녕하세요${index}`}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <ChatInput />
      </div>
    </div>
  );
}
