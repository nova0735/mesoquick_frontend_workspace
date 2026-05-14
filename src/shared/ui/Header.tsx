import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { ShoppingBag, User, Headphones } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-border bg-bg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="text-2xl font-semibold text-accent hover:opacity-80 transition-opacity"
          >
            Mesoquick
          </Link>

          {/* Navegación principal — visible en md+ */}
          <nav className="hidden md:flex items-center gap-1">
            <HeaderLink to={ROUTES.HOME}>Inicio</HeaderLink>
            <HeaderLink to={ROUTES.CATALOG}>Explorar</HeaderLink>
            <HeaderLink to={ROUTES.ORDERS}>Mis pedidos</HeaderLink>
          </nav>

          {/* Acciones del lado derecho */}
          <div className="flex items-center gap-2">
            <Link
              to={ROUTES.SUPPORT}
              className="p-2 rounded hover:bg-accent-bg transition-colors text-text hover:text-accent"
              aria-label="Soporte"
              title="Soporte"
            >
              <Headphones className="w-5 h-5" />
            </Link>

            <Link
              to={ROUTES.CART}
              className="p-2 rounded hover:bg-accent-bg transition-colors text-text hover:text-accent"
              aria-label="Carrito"
              title="Carrito"
            >
              <ShoppingBag className="w-5 h-5" />
              {/* TODO: aquí Persona 2 va a montar el badge con la cantidad */}
            </Link>

            <Link
              to={ROUTES.PROFILE}
              className="p-2 rounded hover:bg-accent-bg transition-colors text-text hover:text-accent"
              aria-label="Mi perfil"
              title="Mi perfil"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

/**
 * Link individual del nav con estado activo.
 * Usa NavLink de react-router para detectar la ruta activa automáticamente.
 */
function HeaderLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded text-sm font-medium transition-colors ${
          isActive
            ? 'text-accent bg-accent-bg'
            : 'text-text hover:text-accent hover:bg-accent-bg'
        }`
      }
    >
      {children}
    </NavLink>
  );
}