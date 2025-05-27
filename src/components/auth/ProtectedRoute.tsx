import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUserInfo } from '@/services/function';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const userInfo = localStorage.getItem('userInfo');

        if (!token || !userInfo) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Parse stored user info
        const user = JSON.parse(userInfo);
        
        // Check if user is admin
        if (!user.isAdmin) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Set axios authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Verify token with server
        await getUserInfo();
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        delete axios.defaults.headers.common['Authorization'];
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
