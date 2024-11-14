import { useEffect } from 'react';
import { socket } from '@/socket';
export function ManagePage() {
  useEffect(() => {
    socket.on('roomCreated', (data) => {
      console.log('roomCreated', data);
    });
  }, []);
  return (
    <div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          socket.emit('createRoom', { userId: 'TEMP_USER_ID' });
        }}
      >
        방 만들기
      </button>
    </div>
  );
}
