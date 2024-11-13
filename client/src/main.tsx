import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from '@/pages';
import { Sidebar } from './widgets/sidebar/Sidebar.tsx';

async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start();
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div className="flex flex-row">
        <Sidebar />
        <Router />
      </div>
    </StrictMode>,
  );
});
