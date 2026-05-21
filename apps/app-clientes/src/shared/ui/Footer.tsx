import { Link } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Branding */}
          <div>
            <h3 className="text-lg font-semibold text-accent mb-2">
              Mesoquick
            </h3>
            <p className="text-sm text-text">
              Tu plataforma de pedidos. Restaurantes, farmacias y supermercados
              en un solo lugar.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="text-sm font-semibold text-text-heading mb-3">
              Explorar
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to={ROUTES.CATALOG}
                  className="text-text hover:text-accent transition-colors"
                >
                  Comercios
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.ORDERS}
                  className="text-text hover:text-accent transition-colors"
                >
                  Mis pedidos
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.SUPPORT}
                  className="text-text hover:text-accent transition-colors"
                >
                  Soporte
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-sm font-semibold text-text-heading mb-3">
              Información
            </h4>
            <ul className="space-y-2 text-sm text-text">
              <li>Arquitectura de Sistemas II</li>
              <li>Universidad Mesoamericana</li>
              <li>Proyecto Final 2026</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-text">
          © 2026 Mesoquick. Proyecto académico — UMES.
        </div>
      </div>
    </footer>
  );
}