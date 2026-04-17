import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base font-sans flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center border-t-4 border-primary">
        <Compass className="w-12 h-12 mx-auto text-primary mb-3" />
        <h1 className="text-2xl font-bold text-primary mb-1">404</h1>
        <p className="text-sm text-gray-600 mb-4">
          La ruta que buscas no existe dentro del panel de agentes.
        </p>
        <Link
          to="/inbox"
          className="inline-block px-4 py-2 bg-green-base text-white font-semibold rounded-lg hover:bg-green-bright transition-colors"
        >
          Volver a la bandeja
        </Link>
      </div>
    </div>
  );
}
