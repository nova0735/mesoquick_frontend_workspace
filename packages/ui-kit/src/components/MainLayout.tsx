import React from 'react';
import { Outlet } from 'react-router-dom';
import { BaseSidebar } from './BaseSidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-base text-primary font-sans">
      <BaseSidebar />
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
};