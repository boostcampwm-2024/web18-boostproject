import { SendIcon } from '@/shared/icon/SendIcon';
import { sendMessage } from '../model/sendMessage';
import { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';

export function ChatInput() {
  const [message, setMessage] = useState('');
  const { roomId } = useParams<{ roomId: string }>();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    if (!message.trim() || !roomId) return;
    sendMessage(message.trim(), roomId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="채팅을 입력하세요"
          className="bg-grayscale-700 rounded-lg w-full p-3 mr-2 focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button type="submit">
          <SendIcon />
        </button>
      </div>
    </form>
  );
}
