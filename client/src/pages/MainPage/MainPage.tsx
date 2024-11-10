import EventImage from '@/assets/main-evnet.png';
import LogoAlbum from '@/assets/logo-album-cover.png';
export function MainPage() {
  return (
    <div className="p-8 pt-20">
      <img src={EventImage} alt="스트리밍이 되고 있는 앨범 사진" />
      <div className="text-gray-50">
        <p className="mt-[70px] mb-7 text-3xl font-bold">최근 등록된 앨범</p>
        <ul className="flex flex-row gap-9 justify-between	">
          {Array.from({ length: 7 }).map((_, index) => (
            <li key={index}>
              <img
                src={LogoAlbum}
                alt="앨범 커버가 등록되지 않은 앨범"
                className="mb-3"
              />
              <p className="text-xl font-semibold mb-1">앨범명명명</p>
              <p className="mb-2">가수명명명</p>
              <p className="text-gray-400 mb-1">#태그 #태그 #태그</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
