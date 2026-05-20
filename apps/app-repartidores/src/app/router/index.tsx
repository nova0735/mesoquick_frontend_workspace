import { createBrowserRouter } from 'react-router-dom';

// 0. Importamos el ErrorBoundary para proteger la aplicación
import { ErrorBoundary } from '../providers/ErrorBoundary';

// 1. Importamos el Cascarón Principal y el Guardián de rutas
import { MainLayout } from '../layout/MainLayout';
import { AuthGuard } from './AuthGuard';

// 2. Importamos nuestras 4 páginas base
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { WalletPage } from '../../pages/wallet/WalletPage';
import { SupportPage } from '../../pages/support/SupportPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';

import { RegisterWizard } from '../../features/register-courier/ui/RegisterWizard';

// 3. Importamos la página 404
import { NotFoundPage } from '../../pages/not-found';

export const appRouter = createBrowserRouter([
  {
    path: '/registro',
    element: <RegisterWizard />
  },
  {
    path: '/',
    // Envolvemos el Layout Principal con el ErrorBoundary y el Guardián
    element: (
      <ErrorBoundary>
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      </ErrorBoundary>
    ),
    children: [
      { 
        index: true, 
        element: <DashboardPage /> // Atrapa la ruta "/"
      },
      { 
        path: 'dashboard', 
        element: <DashboardPage /> // Atrapa la ruta "/dashboard" (¡Esta es la línea que falta!)
      },
      { 
        path: 'wallet', 
        element: <WalletPage /> 
      },
      { 
        path: 'soporte', 
        element: <SupportPage /> 
      },
      { 
        path: 'profile', 
        element: <ProfilePage /> 
      },
      {
        path: '*', // Ruta comodín (Wildcard) que atrapa todo lo no definido arriba
        element: <NotFoundPage />
      }
    ]
  }
]);