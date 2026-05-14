import { Outlet, Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      {/* Header minimalista solo con logo */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-semibold text-accent hover:opacity-80 transition-opacity"
          >
            Mesoquick
          </Link>
        </div>
      </header>

      {/* Contenido centrado vertical y horizontalmente */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}