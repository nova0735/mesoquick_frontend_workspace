import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { AuthGuard } from './AuthGuard';
import { ErrorBoundary } from '../providers/ErrorBoundary';

// Inline placeholder for 404 until the real one is fully built
const NotFoundFallback = () => <div className="p-10 text-xl">404 - Ruta no encontrada</div>;
const LoginFallback = () => <div className="p-10 text-xl">Pantalla de Login Pública</div>;

export const appRouter = createBrowserRouter([
  {
    path: '/login',
    element: <LoginFallback />,
  },
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <div className="text-primary text-xl">Dashboard Protegido</div> },
      { path: 'dashboard', element: <div className="text-primary text-xl">Dashboard Protegido</div> },
    ],
  },
  {
    path: '*',
    element: <NotFoundFallback />
  },
]);