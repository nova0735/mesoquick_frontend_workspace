import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/login/LoginPage';
// 1. Importa la nueva página
import { RegisterSelectionPage } from '../../pages/login/register-selection/RegisterSelectionPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  // 2. Agrega la nueva ruta intermedia
  {
    path: '/register',
    element: <RegisterSelectionPage />,
  },
  {
    path: '*',
    element: <LoginPage />,
  }
]);