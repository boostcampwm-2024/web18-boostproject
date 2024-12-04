import { MainPage } from '@/pages/MainPage';
import { StreamingPage } from '@/pages/StreamingPage';
import { Layout } from '@/Layout';
import { AdminPage } from '@/pages/AdminPage';
import { AdminLoginPage } from '@/pages/AdminLoginPage';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { AlbumPage } from '@/pages/AlbumPage';

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
