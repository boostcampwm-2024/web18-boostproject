import { Outlet } from 'react-router-dom';
import { Sidebar } from './widgets/sidebar/Sidebar';

export function Layout() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
