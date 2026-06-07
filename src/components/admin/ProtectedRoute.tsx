import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-primary border-r-secondary rounded-full animate-spin" />
        </div>
        
        <div className="flex items-center space-x-1.5 text-xs text-textSecondary font-semibold">
          <Sparkles size={14} className="text-secondary animate-pulse" />
          <span>Verifying admin credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, saving the original location
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
export default ProtectedRoute;
