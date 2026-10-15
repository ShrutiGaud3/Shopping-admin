import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-700">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-8 h-8 text-emerald-600 animate-pulse" />
          </div>
          <Loader2 className="w-20 h-20 text-emerald-600 animate-spin absolute" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-600">Verifying Administrator Permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
