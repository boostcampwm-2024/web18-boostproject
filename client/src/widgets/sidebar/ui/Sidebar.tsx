import { InearLogo } from '@/shared/icon/InearLogo';
import { RoomList } from './RoomList';
import { Credit } from './Credit';
import { Link } from 'react-router-dom';
export function Sidebar() {
  return (
    <nav className="bg-grayscale-900 w-[250px] flex flex-col justify-between min-h-full">
      <div>
        <Link
          to="/"
          className="block m-8 w-fit"
          aria-label="메인 페이지로 이동"
        >
          <InearLogo />
        </Link>
        <RoomList />
      </div>
      <Credit />
    </nav>
  );
}
