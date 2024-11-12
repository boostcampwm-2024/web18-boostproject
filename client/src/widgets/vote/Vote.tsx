import { ChevronDown } from '@/shared/icons/ChevronDown';
import { useState } from 'react';

export function Vote() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="absolute top-[5.5rem] left-0 right-0 bg-gray-700  z-10 mx-8 rounded-lg">
      <div
        className="flex flex-row items-center justify-between px-5 py-3 rounded-lg cursor-pointer hover:bg-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="mr-2">
          <p className="text-gray-300">최애의 트랙</p>
          <p className="text-lg font-semibold">겨울 간식 뭐가 더 좋나</p>
        </div>
        <div
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDown />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-40' : 'max-h-0'} px-4`}
      >
        {['슈크림 붕어빵', '팥 붕어빵', '피자 붕어빵'].map((item, index) => (
          <p
            key={index}
            className="mb-1 cursor-pointer px-3 py-3 rounded-md hover:bg-gray-600"
          >
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
