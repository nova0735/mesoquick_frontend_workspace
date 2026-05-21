// src/features/auth/ui/SessionBadge.tsx

import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '../model/useAuthStore';

export function SessionBadge() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <button
        onClick={() => navigate(ROUTES.REGISTER)}
        className="flex items-center gap-1.5 text-sm text-text/60 hover:text-accent transition-colors"
      >
        <User className="w-4 h-4" />
        <span>Registrarse</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5">
        <div className="w-7 h-7 bg-accent rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium text-text-heading hidden sm:block">
          {user.name.split(' ')[0]}
        </span>
      </div>

      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="p-1.5 text-text/40 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
        title="Cerrar sesión"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
}