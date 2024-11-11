import { ChevronDown } from '@/shared/icons/ChevronDown';
import { useState } from 'react';
//TODO: 투표 폴딩 기능 추가

export function Vote() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-gray-700 mb-8">
      <div
        className="flex flex-row items-center justify-between px-5 py-3 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-2">
          <p className="text-gray-300">최애의 트랙</p>
          <p className="text-lg font-semibold">겨울 간식 뭐가 더 좋나</p>
        </div>
        <div
          className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDown />
        </div>
      </div>
      {isOpen && (
        <div>
          <p>슈크림 붕어빵</p>
          <p>팥 붕어빵</p>
          <p>피자 붕어빵</p>
        </div>
      )}
    </div>
  );
}
