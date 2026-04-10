import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@mesoquick/ui-kit';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div className="p-4 text-primary text-xl">Dashboard Loading...</div>,
      },
      {
        path: 'dashboard',
        element: <div className="p-4 text-primary text-xl">Dashboard Active</div>,
      },
      {
        path: 'wallet',
        element: <div className="p-4 text-primary text-xl">Wallet Module</div>,
      },
      {
        path: 'support',
        element: <div className="p-4 text-primary text-xl">Support Center</div>,
      },
      {
        path: 'profile',
        element: <div className="p-4 text-primary text-xl">Courier Profile</div>,
      },
    ],
  },
]);