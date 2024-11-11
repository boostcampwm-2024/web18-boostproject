import { ChevronDown } from '@/shared/icons/ChevronDown';

//TODO: 투표 폴딩 기능 추가

export function Vote() {
  return (
    <div className="bg-gray-700 flex flex-row items-center justify-between px-5 py-3 rounded-lg mb-8">
      <div className="mr-2">
        <p className="text-gray-300">최애의 트랙</p>
        <p className="text-lg font-semibold">겨울 간식 뭐가 더 좋나</p>
      </div>
      <div onClick={() => console.log('click')}>
        <ChevronDown />
      </div>
    </div>
  );
}
