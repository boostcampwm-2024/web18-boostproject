import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './MainPage';
import { StreamingPage } from './StreamingPage';
import { Layout } from '@/Layout';
import { ManagePage } from './ManagePage';

const router = createBrowserRouter(
  [
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
  ],
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_relativeSplatPath: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);

export function Router() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}
