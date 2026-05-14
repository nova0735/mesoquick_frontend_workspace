import { Outlet } from 'react-router-dom';
import Header from '@shared/ui/Header';
import Footer from '@shared/ui/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}