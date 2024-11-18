import { socket } from '@/shared/api/socket';
import { useStreamingRoom } from '@/shared/hook/useStreamingRoom';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui';
import { useCallback, useState } from 'react';

export function AdminPage() {
  const { isConnected } = useStreamingRoom();
  const [songTitle, setSongTitle] = useState('');
  const [songList, setSongList] = useState<string[]>([]);
  const now = new Date();

  const handleAddSong = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.nativeEvent.isComposing) return;
      if (e.key === 'Enter') {
        e.preventDefault(); // Enter 키의 기본 동작 방지
        if (songTitle.trim()) {
          setSongList((prev) => [...prev, songTitle.trim()]);
          setSongTitle('');
        }
      }
    },
    [songTitle],
  );

  if (!isConnected) {
    return (
      <div className="text-grayscale-100">소켓이 연결되지 않았습니다.</div>
    );
  }

  const handleCreateRoom = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('createRoom');
    socket.emit('createRoom', { userId: 'TEMP_USER_ID' }, (response: any) => {
      console.log('createRoom', response);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="w-full max-w-5xl flex flex-row gap-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="w-1/4 flex flex-col gap-4">
          <Input labelName="앨범 이름" />
          <Input labelName="앨범 아티스트" />
          <Input labelName="앨범 태그" placeholder="힙합, 댄스, 국내" />
          <Input
            labelName="발매일"
            type="date"
            min={now.toISOString().slice(0, 10)}
          />
          <Input
            labelName="발매 시간"
            type="time"
            min={`${now.getHours()}:${now.getMinutes() + 1}`}
          />
          <Input labelName="앨범 트랙 개수" type="number" />
        </div>
        <div className="w-2/4 flex flex-col justify-between gap-4">
          <div>
            <Input
              labelName="노래 제목"
              value={songTitle}
              onChange={(e) => setSongTitle(e.target.value)}
              onKeyDown={handleAddSong}
              placeholder="노래 제목을 입력하고 Enter를 누르세요"
            />
            <ul className="text-grayscale-100 mt-5 max-h-80 overflow-y-auto">
              {songList.map((song, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between mb-2"
                >
                  <span>
                    {index + 1} . {song}
                  </span>
                  <button
                    onClick={() =>
                      setSongList(songList.filter((_, i) => i !== index))
                    }
                    className="text-red-500 hover:text-red-600"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <Button message="등록하기" onClick={handleCreateRoom} type="button" />
        </div>
        <div className="w-1/4 flex flex-col gap-4">
          <Input labelName="파일 등록" />

          {/* <Button message="방 만들기" clickHandler={handleCreateRoom} /> */}
        </div>
      </form>
    </div>
  );
}
