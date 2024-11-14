import { Album } from '@/entities/album/types';
import { ChevronDown } from '@/shared/icons/ChevronDown';
import { useState } from 'react';

interface AlbumInfoProps {
  album: Album;
}

export function AlbumInfo({ album }: AlbumInfoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('lyrics');

  return (
    <div className="flex flex-col items-center w-7/12 relative">
      <div className="text-center mb-32 w-full">
        <p className="text-gray-300 mb-4">#{album.tags.join(' #')}</p>
        <p className="text-3xl font-bold mb-4">{album.title}</p>
        <p>{album.artist}</p>
      </div>
      <div className="flex flex-col items-center">
        <p className="text-sm mb-3">{album.currentTime}</p>
        <img
          src={album.coverImage}
          alt="Album Cover"
          className="w-52 h-52 object-cover rounded-lg mb-4"
        />
        <p className="text-2xl font-bold">{album.trackName}</p>
      </div>
      <div
        className={`absolute bottom-0 w-full bg-grayscale-800 text-gray-100 rounded-t-lg 
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-56px)]'}`}
      >
        <div className="flex flex-row justify-between px-6 py-4 items-center bg-grayscale-900 rounded-t-lg">
          <div className="flex flex-row space-x-4">
            <button className="mr-4" onClick={() => setCategory('lyrics')}>
              가사
            </button>
            <button onClick={() => setCategory('playlist')}>
              플레이리스트
            </button>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`transform transition-transform duration-100 ease-in-out
              ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          >
            <ChevronDown />
          </button>
        </div>
        <div
          className={`px-6 py-4 h-64 transition-opacity duration-200 ease-in-out
            ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
          {category === 'lyrics' ? <p>가사</p> : <p>플레이리스트</p>}
        </div>
      </div>
    </div>
  );
}
