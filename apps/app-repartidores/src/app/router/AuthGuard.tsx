import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    const loginUrl = import.meta.env.VITE_APP_LOGIN_URL || 'http://localhost:5173/login';
    window.location.href = loginUrl;
    return null;
  }
  
  return <>{children}</>;
};