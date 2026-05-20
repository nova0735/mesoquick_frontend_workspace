import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Phone,
  Mail,
  LogOut,
  Pencil,
  CreditCard,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { Card, Button } from '@shared/ui';
import { ROUTES } from '@app/router/routes';
import { useAuthStore } from '@features/auth/model/useAuthStore';
import { formatDate } from '@shared/lib/formatters';
import { SavedCardsList } from '@features/payments';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Vista sin sesión: muestra opciones de Login + Registro
  if (!isAuthenticated || !user) {
    return (
      <main className="max-w-md mx-auto px-4 py-10 text-center space-y-6">
        <div>
          <div className="w-16 h-16 bg-accent-bg rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-7 h-7 text-accent" />
          </div>
          <h1 className="text-text-heading font-bold text-2xl">
            Tu cuenta
          </h1>
          <p className="text-text/60 text-sm mt-1">
            Iniciá sesión para ver tus pedidos, tarjetas y datos.
          </p>
        </div>

        <div className="space-y-2">
          <Button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="w-full flex items-center justify-center gap-2 bg-accent text-white hover:bg-accent/90 py-3 rounded-xl font-semibold"
          >
            <LogIn className="w-4 h-4" />
            Iniciar sesión
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.REGISTER)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium"
          >
            <UserPlus className="w-4 h-4" />
            Crear cuenta nueva
          </Button>
        </div>
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
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-heading">Información</h2>
          <Link
            to={ROUTES.PROFILE_EDIT}
            className="inline-flex items-center gap-1 text-sm text-accent hover:opacity-80 transition-opacity"
          >
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>
        </div>

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
            <p className="text-sm text-text-heading font-medium">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-accent-bg p-2 rounded-lg">
            <Phone className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs text-text/50">Teléfono</p>
            <p className="text-sm text-text-heading font-medium">
              {user.phone}
            </p>
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

      {/* Métodos de pago */}
      <Card className="p-4 border border-border space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-accent" />
          <h2 className="font-semibold text-text-heading">Métodos de pago</h2>
        </div>
        <p className="text-xs text-text/60 -mt-2">
          Tus tarjetas se guardan de forma segura. Solo almacenamos los últimos 4 dígitos.
        </p>
        <SavedCardsList variant="profile" />
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