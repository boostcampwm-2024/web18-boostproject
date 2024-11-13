import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainPage } from './MainPage';
import { StreamingPage } from './StreamingPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/streaming',
    element: <StreamingPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
