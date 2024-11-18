import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import { routerConfig } from './config';

const router = createBrowserRouter(routes, routerConfig);

export function Router() {
  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  );
}
