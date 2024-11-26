import { MainPage } from '@/pages/MainPage';
import { StreamingPage } from '@/pages/StreamingPage';
import { Layout } from '@/Layout';
import { AdminPage } from '@/pages/AdminPage';
import { AlbumPage } from '@/pages/AlbumPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/streaming/:roomId',
        element: <StreamingPage />,
      },
      {
        path: '/album/:albumId',
        element: <AlbumPage />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
];
