import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/verify-token`,
          {
            withCredentials: true,
          },
        );
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
