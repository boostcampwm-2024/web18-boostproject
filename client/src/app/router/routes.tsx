import { MainPage } from '@/pages/MainPage';
import { StreamingPage } from '@/pages/StreamingPage';
import { Layout } from '@/Layout';
import { ManagePage } from '@/pages/ManagePage';
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
    path: '/manager',
    element: <ManagePage />,
  },
];
