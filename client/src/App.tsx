import { Outlet, Route, Routes } from 'react-router-dom';
import { MainPage } from '@/pages/MainPage';
import { StreamingPage } from '@/pages/StreamingPage';
import { AdminPage } from '@/pages/AdminPage';
import { AlbumPage } from '@/pages/AlbumPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { Sidebar } from './widgets/sidebar/ui/Sidebar';
import { GlobalBoundary } from './GlobalBoundary';

const MainLayout = () => (
  <div className="flex flex-row">
    <Sidebar />
    <div className="flex-1">
      <Outlet />
    </div>
  </div>
);

export function App() {
  return (
    <GlobalBoundary>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<MainPage />} />
          <Route path="/streaming/:roomId" element={<StreamingPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </GlobalBoundary>
  );
}
