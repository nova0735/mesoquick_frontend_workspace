import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmptyState, Button } from '@shared/ui';
import { ROUTES } from '@app/router/routes';

export default function EmptyCart() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<ShoppingCart className="w-12 h-12" />}
      title="Tu carrito está vacío"
      description="Explora los comercios y agrega productos para comenzar tu pedido."
      action={
        <Button onClick={() => navigate(ROUTES.CATALOG)}>
          Explorar comercios
        </Button>
      }
    />
  );
}
