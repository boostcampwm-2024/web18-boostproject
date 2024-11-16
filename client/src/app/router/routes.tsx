import { MainPage } from '../../pages/MainPage';
import { StreamingPage } from '../../pages/StreamingPage';
import { Layout } from '@/Layout';
import { ManagePage } from '../../pages/ManagePage';

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
    ],
  },
  {
    path: '/manager',
    element: <ManagePage />,
  },
];
