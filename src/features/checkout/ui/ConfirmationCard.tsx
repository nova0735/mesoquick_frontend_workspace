import { CheckCircle, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';
import { buildRoute, ROUTES } from '@app/router/routes';

interface ConfirmationCardProps {
  orderId: string;
}

export default function ConfirmationCard({ orderId }: ConfirmationCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-10 px-6 space-y-5">
      {/* Ícono de éxito */}
      <div className="w-20 h-20 rounded-full bg-accent-bg flex items-center justify-center">
        <CheckCircle className="w-10 h-10 text-accent" />
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text-heading">¡Pedido confirmado!</h1>
        <p className="text-text text-sm">Tu pedido ha sido recibido y está siendo procesado.</p>
      </div>

      {/* ID del pedido */}
      <div className="flex items-center gap-2 px-4 py-2 bg-accent-bg rounded-lg border border-accent-border">
        <Package className="w-4 h-4 text-accent" />
        <span className="text-xs text-text">Pedido</span>
        <span className="text-sm font-mono font-semibold text-accent">{orderId}</span>
      </div>

      <p className="text-sm text-text max-w-xs">
        Puedes rastrear tu pedido en tiempo real desde la pantalla de seguimiento.
      </p>

      {/* Acciones */}
      <div className="w-full space-y-2 max-w-xs">
        <Button
          fullWidth
          onClick={() => navigate(buildRoute.orderTracking(orderId))}
          leftIcon={<Package className="w-4 h-4" />}
        >
          Rastrear mi pedido
        </Button>
        <Button
          fullWidth
          variant="outline"
          onClick={() => navigate(ROUTES.CATALOG)}
        >
          Seguir comprando
        </Button>
      </div>
    </div>
  );
}
