import { SendIcon } from '@/shared/icon/SendIcon';
import { sendMessage } from '../model/sendMessage';
import { useState, FormEvent, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useSocketStore } from '@/shared/store/useSocketStore';

export const ChatInput = memo(() => {
  const [message, setMessage] = useState('');
  const { roomId } = useParams<{ roomId: string }>();
  const { socket } = useSocketStore();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message.trim() || !roomId || !socket?.connected) return;

    sendMessage(message.trim(), roomId);
    setMessage('');
  };

  // 소켓 연결 또는 메시지 변경 시에만 리렌더링
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
        <button type="submit" disabled={!socket?.connected}>
          <SendIcon />
        </button>
      </div>
    </form>
  );
});
