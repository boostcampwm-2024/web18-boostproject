import EventImage from '@/assets/main-event.png';
import { AlbumList } from '@/widgets/albums';

export function MainPage() {
  console.log(Date.now());
  return (
    <div className="p-8 pt-20">
      <img src={EventImage} alt="스트리밍이 되고 있는 앨범 사진" />
      <AlbumList />
    </div>
  );
}
