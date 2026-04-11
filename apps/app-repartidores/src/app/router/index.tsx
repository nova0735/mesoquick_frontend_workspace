import { createBrowserRouter } from 'react-router-dom';

// 1. Importamos el Cascarón Principal (El que tiene el Sidebar)
import { MainLayout } from '../layout/MainLayout';

// 2. Importamos nuestras 4 páginas base
import { DashboardPage } from '../../pages/dashboard/DashboardPage';
import { WalletPage } from '../../pages/wallet/WalletPage';
import { SupportPage } from '../../pages/support/SupportPage';
import { ProfilePage } from '../../pages/profile/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // <-- El Layout envuelve la pantalla
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
      }
    ]
  }
]);