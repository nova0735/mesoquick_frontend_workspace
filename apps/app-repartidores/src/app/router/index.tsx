import { createBrowserRouter } from 'react-router-dom';

// 0. Importamos el ErrorBoundary para proteger la aplicación
import { ErrorBoundary } from '../providers/ErrorBoundary';

// 1. Importamos el Cascarón Principal (El que tiene el Sidebar)
import { MainLayout } from '../layout/MainLayout';

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
    // Envolvemos el Layout Principal con el ErrorBoundary global
    element: (
      <ErrorBoundary>
        <MainLayout />
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
        path: 'support', 
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