import { SendIcon } from '@/shared/icon/SendIcon';
import { socket } from '@/shared/api/socket';
import { useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { roomId } = useParams();

  // TODOS: 최적화 필요
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(
      'message',
      { message: message, roomId: roomId },
      (response: any) => {
        console.log(response);
      },
    );
    setMessage('');
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
