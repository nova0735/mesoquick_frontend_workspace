import { Link, NavLink } from 'react-router-dom';
import { ROUTES } from '@app/router/routes';
import { ShoppingBag, User, Headphones } from 'lucide-react';
import { useBrokerHealth } from '@shared/hooks/useBrokerHealth';

export default function Header() {
  // Estado en vivo del broker. El dot animado al lado del logo y un tooltip
  // reflejan en tiempo real si estamos hablando con el broker o con el
  // respaldo local. Cuando el broker se cae, el usuario ve un dot ámbar
  // — sin alarmismo — y la app sigue funcionando con fallbacks.
  const brokerStatus = useBrokerHealth();
  const isOnline = brokerStatus === 'online';
  const isChecking = brokerStatus === 'checking';

  const dotColor = isOnline
    ? 'bg-emerald-300'
    : isChecking
      ? 'bg-emerald-400/60'
      : 'bg-amber-400';
  const dotAnim = isOnline ? 'animate-pulse' : '';
  const dotTitle = isOnline
    ? 'Conectado al servicio en línea'
    : isChecking
      ? 'Verificando conexión...'
      : 'Modo offline — usando respaldo local';

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 border-b border-emerald-950/50 shadow-lg shadow-emerald-950/20">
      {/* Decoración sutil de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(52,211,153,0.15),_transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.1),_transparent_50%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to={ROUTES.HOME}
            className="group flex items-center gap-2 transition-opacity hover:opacity-90"
          >
            {/* Icono decorativo del logo */}
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/30 transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg leading-none">M</span>
              </div>
              <div
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-emerald-900 transition-colors ${dotColor} ${dotAnim}`}
                title={dotTitle}
                aria-label={dotTitle}
              />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold text-white tracking-tight">
                Meso<span className="text-emerald-300">quick</span>
              </span>
              <span className="text-[10px] text-emerald-300/70 font-medium tracking-wider uppercase mt-0.5">
                Delivery
              </span>
            </div>
          </Link>

          {/* Navegación principal — visible en md+ */}
          <nav className="hidden md:flex items-center gap-1 bg-emerald-950/40 backdrop-blur-sm rounded-full p-1 border border-emerald-700/30">
            <HeaderLink to={ROUTES.HOME}>Inicio</HeaderLink>
            <HeaderLink to={ROUTES.CATALOG}>Explorar</HeaderLink>
            <HeaderLink to={ROUTES.ORDERS}>Mis pedidos</HeaderLink>
          </nav>

          {/* Acciones del lado derecho */}
          <div className="flex items-center gap-1">
            <IconLink
              to={ROUTES.SUPPORT}
              label="Soporte"
              icon={<Headphones className="w-5 h-5" />}
            />
            <IconLink
              to={ROUTES.CART}
              label="Carrito"
              icon={<ShoppingBag className="w-5 h-5" />}
            />
            <IconLink
              to={ROUTES.PROFILE}
              label="Mi perfil"
              icon={<User className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* Línea decorativa inferior con gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
    </header>
  );
}

/**
 * Link individual del nav con estado activo.
 * Estilo "pill" sobre fondo oscuro.
 */
function HeaderLink({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={to === ROUTES.HOME}
      className={({ isActive }) =>
        `px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          isActive
            ? 'bg-white text-emerald-900 shadow-sm'
            : 'text-emerald-100 hover:text-white hover:bg-emerald-700/50'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

/**
 * Icono de acción del header derecho.
 */
function IconLink({
  to,
  label,
  icon,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="relative p-2.5 rounded-xl text-emerald-100 hover:text-white hover:bg-emerald-700/50 transition-all group"
    >
      {icon}
    </Link>
  );
}