import { InearLogo } from '@/shared/icons/InearLogo';
import EventImage from '@/assets/sidebar-event.png';
import StreamingList from './StreamingList';
import { Credit } from './Credit';
export function Sidebar() {
  return (
    <nav className="bg-grayscale-900 w-[250px] h-screen">
      <div className="m-8">
        <InearLogo />
      </div>
      <div className="flex flex-col items-center">
        <img
          src={EventImage}
          alt="곧 스트리밍이 시작되는 앨범 사진"
          className="w-[192px] h-[192px]"
        />
        <StreamingList />
        <Credit />
      </div>
    </nav>
  );
}
