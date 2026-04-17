import { NavLink } from 'react-router-dom';
import { BookOpen, HelpCircle, Inbox, LifeBuoy, Users } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Sidebar del backoffice de agentes. Lista los nodos de navegación del
 * módulo. Irá creciendo conforme se construyan las demás fases:
 *   - Fase 2: FAQs
 *   - Fase 3: Directorio interno
 *   - Fase 4: Consulta de usuario
 *   - Fase 5: Herramientas administrativas
 *   - Fase 6: Chats (inbox ya existe como placeholder)
 *
 * TODO(ui-kit): cuando @mesoquick/ui-kit exporte un <BaseSidebar /> estable y
 * reutilizable, migrar este wrapper para delegarle la estructura.
 */
interface NavItem {
  to: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/inbox', label: 'Bandeja de chats', Icon: Inbox },
  { to: '/users', label: 'Consulta de usuarios', Icon: Users },
  { to: '/faqs', label: 'Preguntas frecuentes', Icon: HelpCircle },
  { to: '/directory', label: 'Directorio interno', Icon: BookOpen },
  // Los demás items se irán añadiendo en sus respectivas fases.
];

export function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-primary text-white flex flex-col shadow-lg">
      <div className="p-6 border-b border-white/20">
        <div className="font-bold text-2xl leading-tight">MesoQuick</div>
        <div className="text-xs uppercase tracking-wider text-white/70 mt-1">
          Servicio al Cliente
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/20 text-xs text-white/60 flex items-center gap-2">
        <LifeBuoy className="w-4 h-4" />
        <span>Panel de agentes v0.1</span>
      </div>
    </aside>
  );
}
