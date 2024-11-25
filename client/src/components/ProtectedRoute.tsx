import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('authorization');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
