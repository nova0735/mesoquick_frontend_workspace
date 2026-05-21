import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { ShieldCheck } from 'lucide-react';

export default function CheckoutLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-semibold text-accent hover:opacity-80 transition-opacity"
          >
            Mesoquick
          </Link>
          <div className="flex items-center gap-2 text-sm text-text">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Compra segura</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}