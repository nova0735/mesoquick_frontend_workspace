import { useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut } from 'lucide-react';
import { Card, Button } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { formatDate } from '@shared/lib/formatters';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  if (!isAuthenticated || !user) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-6 text-center">
        <p className="text-text/60 mb-4">Debes iniciar sesión para ver tu perfil</p>
        <Button
          onClick={() => navigate(ROUTES.REGISTER)}
          className="bg-accent text-white px-6 py-2 rounded-xl hover:bg-accent/90 transition-colors"
        >
          Crear cuenta
        </Button>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Avatar y nombre */}
      <Card className="p-6 border border-border text-center">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <h1 className="text-text-heading font-bold text-xl">{user.name}</h1>
        <p className="text-text/50 text-sm mt-1">
          Miembro desde {formatDate(user.createdAt)}
        </p>
      </Card>

      {/* Datos del perfil */}
      <Card className="p-4 border border-border space-y-4">
        <h2 className="font-semibold text-text-heading">Información</h2>

        <div className="flex items-center gap-3">
          <div className="bg-accent-bg p-2 rounded-lg">
            <User className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text/50">Nombre</p>
            <p className="text-sm text-text-heading font-medium">{user.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-accent-bg p-2 rounded-lg">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text/50">Correo</p>
            <p className="text-sm text-text-heading font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-accent-bg p-2 rounded-lg">
            <Phone className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text/50">Teléfono</p>
            <p className="text-sm text-text-heading font-medium">{user.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-accent-bg p-2 rounded-lg">
            <MapPin className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text/50">Dirección principal</p>
            <p className="text-sm text-text-heading font-medium">
              {user.defaultAddress}
            </p>
          </div>
        </div>
      </Card>

      {/* Cerrar sesión */}
      <Button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 transition-colors py-3 rounded-xl font-medium"
      >
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </Button>
    </main>
  );
}