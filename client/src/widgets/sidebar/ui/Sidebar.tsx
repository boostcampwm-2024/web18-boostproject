import { InearLogo } from '@/shared/icon/InearLogo';
import { RoomList } from './RoomList';
import { Credit } from './Credit';
import { Link } from 'react-router-dom';
export function Sidebar() {
  return (
    <nav className="bg-grayscale-900 w-[250px] h-screen">
      <Link to="/" className="block m-8 w-fit">
        <InearLogo />
      </Link>
      <div className="flex flex-col items-center justify-between h-full">
        <RoomList />
        <Credit />
      </div>
    </nav>
  );
}
