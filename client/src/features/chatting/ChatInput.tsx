import { SendIcon } from '@/shared/icons/SendIcon';
import { socket } from '@/socket';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { roomId } = useParams();

  const sendMessage = () => {
    socket.emit(
      'message',
      { message: message, roomId: roomId },
      (response: any) => {
        console.log(response);
      },
    );
    console.log('sendMessage');
    setMessage('');
  };

  const handleOnKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      console.log('Enter');
      sendMessage();
    }
  };
  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          placeholder="채팅을 입력하세요"
          className="bg-grayscale-700 rounded-lg w-full p-3 mr-2 focus:outline-none"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={handleOnKeyDown}
        />
        <button onClick={sendMessage}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
}
