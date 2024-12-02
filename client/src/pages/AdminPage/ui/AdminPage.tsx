import { Button } from '@/shared/ui';
import { AlbumForm, SongForm } from '@/features/albumRegister';
import { useAlbumForm } from '@/features/albumRegister/model/useAlbumForm';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InearLogo } from '@/shared/icon/InearLogo';

export function AdminPage() {
  const { handleSubmit, handleAddSong, songs, songFormRef, albumFormRef } =
    useAlbumForm();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handlePost = async () => {
    if (!albumFormRef.current || songs.length === 0) return;
    setIsLoading(true);
    try {
      await handleSubmit();
      setIsSuccess(true);
      albumFormRef.current.reset();

      setTimeout(() => {
        setIsSuccess(false);
      }, 10000);
    } catch (error) {
      console.error('방 생성 실패:', error);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-row items-center mb-12 gap-8">
        <Link to="/" className="block w-fit">
          <InearLogo />
        </Link>
        <p className="text-grayscale-100 text-4xl font-bold">
          관리자 페이지
        </p>
      </div>
      <div className="w-full h-fit max-w-5xl grid grid-cols-6 gap-6">
        <AlbumForm albumFormRef={albumFormRef} />
        <SongForm songFormRef={songFormRef} />
        <div className="col-span-2 flex flex-col gap-4">
          <label className="text-grayscale-100 text-sm">목록</label>
          <ul className="h-full text-grayscale-100 overflow-y-auto">
            {songs.map((song, index) => (
              <li key={index} className="py-2 border-b border-gray-200">
                {index + 1}. {song.title}
              </li>
            ))}
          </ul>
          <div className="flex flex-row gap-4">
            <Button message="노래 추가" onClick={handleAddSong} />
            <Button
              message={isLoading ? '생성 중...' : '방 만들기'}
              onClick={handlePost}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.5 : 1 }}
            />
            {isSuccess && (
              <span className="text-sm text-green-500 ml-2">
                ✔ 방 생성 완료
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
