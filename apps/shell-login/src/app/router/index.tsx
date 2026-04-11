import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../../pages/login/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <LoginPage />, // Si escriben una URL que no existe, los regresa al login
  }
]);