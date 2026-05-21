import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  // a. Extract the token from the URL
  const params = new URLSearchParams(window.location.search);
  const tokenFromUrl = params.get('token');

  if (tokenFromUrl) {
    // b. Persist to localStorage
    localStorage.setItem('access_token', tokenFromUrl);
    
    // c. Purge the token from the visible URL for security
    window.history.replaceState(null, '', window.location.pathname);
  }

  // d. Fallback: Retrieve the token from localStorage
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    // e. Redirect to Shell Login if no token is present
    const loginUrl = import.meta.env?.VITE_SHELL_LOGIN_URL || import.meta.env?.VITE_APP_LOGIN_URL || 'http://localhost:5173/login';
    window.location.href = loginUrl;
    return null;
  }
  
  return <>{children}</>;
};