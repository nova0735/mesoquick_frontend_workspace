import React from 'react';
import { Outlet } from 'react-router-dom';
import { BaseSidebar } from '@mesoquick/ui-kit';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f7f7f7]">
      <BaseSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};