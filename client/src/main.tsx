import { createRoot } from 'react-dom/client';
import './index.css';
import { Router } from '@/pages/Router';

createRoot(document.getElementById('root')!).render(
  <>
    <Router />
  </>,
);
