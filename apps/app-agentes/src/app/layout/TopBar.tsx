import { useNavigate } from 'react-router-dom';
import { LogOut, UserCircle2 } from 'lucide-react';
import { useSessionStore } from '../../entities/session';

/**
 * Barra superior del layout: muestra el nombre del agente logueado y el
 * botón de cerrar sesión. El logout por ahora solo purga el store + localStorage
 * (mock). Cuando el backend exista, se añadirá una llamada a POST /api/auth/logout
 * antes del clear() — ver TODO(backend).
 */
export function TopBar() {
  const user = useSessionStore((state) => state.user);
  const clear = useSessionStore((state) => state.clear);
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO(backend): await http.post('/api/auth/logout');
    clear();
    navigate('/login', { replace: true });
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <UserCircle2 className="w-5 h-5" />
        <span className="text-sm font-semibold">{user?.name ?? 'Agente'}</span>
        <span className="text-xs text-gray-400 font-normal">
          · {user?.id}
        </span>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-base rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </header>
  );
}
