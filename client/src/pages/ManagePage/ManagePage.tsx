import { socket } from '@/socket';
import { useStreamingRoom } from '../StreamingPage/useStreamingRoom';

export function ManagePage() {
  const { isConnected } = useStreamingRoom();

  return (
    <div>
      <button
        className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          console.log('createRoom');
          socket.emit(
            'createRoom',
            { userId: 'TEMP_USER_ID' },
            (response: any) => {
              console.log('createRoom', response);
            },
          );
        }}
      >
        방 만들기
      </button>
    </div>
  );
}
